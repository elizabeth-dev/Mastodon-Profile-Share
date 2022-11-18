import React, {FormEvent, useState} from 'react';
import styles from './Main.module.scss';

const FULL_MASTODON_USER_REGEX = /^@\w+@.+$/
const MASTODON_INSTANCE_REGEX = /^(?:https?:\/\/)?(?<domain>.+)\.(?<tld>.+)\/?.*$/

function Main() {
    const currentUrl = localStorage.getItem("preferredInstance") ?? "";
    const currentUser = localStorage.getItem("user") ?? "";

    const [url, setUrl] = useState(currentUrl)
    const [urlMsg, setUrlMsg] = useState("")
    const [shareableUser, setShareableUser] = useState(currentUser)
    const [rawUser, setRawUser] = useState(currentUser)
    const [clipboardMsg, setClipboardMsg] = useState("")

    const handleUrlSubmit = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        const match = url.match(MASTODON_INSTANCE_REGEX)
        if (!match?.groups?.domain || !match?.groups?.tld) {
            setUrlMsg("Invalid instance")
            return;
        }

        localStorage.setItem("preferredInstance", `${match.groups.domain}.${match.groups.tld}`)
        setUrlMsg("Instance saved!")
    }

    const handleUserChange = (user: string) => {
        setRawUser(user)

        if (!FULL_MASTODON_USER_REGEX.test(user)) {
            setShareableUser("");
            localStorage.setItem("user", "")
            return;
        }

        setShareableUser(user)
        localStorage.setItem("user", user)
    }

    const copyShareableLink = async () => {
        if (!shareableUser) {
            setClipboardMsg("Invalid username");
            return;
        }

        try {
           await navigator.clipboard.writeText(`mastodonprofile.web.app/${shareableUser}`)
            setClipboardMsg("Link copied to your clipboard!")

        }catch (e) {
            setClipboardMsg("There was an error copying the link to your clipboard")
        }
    }

    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                <h1 className={styles.title}>Mastodon Profile Share</h1>
                <p className={styles.description}>
                    This is a tool to make sharing your Mastodon profile easier. Mastodon is a federated social network,
                    which means that users pick their preferred instance to register their profile. Unfortunately, this also
                    means that, when sharing your profile, you'll be sharing a URL to <b>your</b> instance, which may not be
                    the one used by whoever receives that URL.
                </p>
                <p className={styles.description}>
                    This tool lets you register (locally, per-device) the instance you use, and get a "universal" URL to
                    your profile. That URL will redirect anyone who navigates to it to your profile, but on their previously
                    configured preferred instance. This way they will be able to interact with you from their account
                    immediately. If they don't have any configured instance, it'll redirect to the instance where your
                    profile is registered.
                </p>
                <form className={styles.urlForm} onSubmit={handleUrlSubmit}>
                    <input className={styles.url} type="text" placeholder="Your Mastodon instance" value={url}
                           onChange={(ev) => setUrl(ev.target.value)}/>
                    <input type="submit" className={styles.saveButton} value="Save" />
                    <span className={styles.urlMsg}>{urlMsg}</span>
                </form>

                <span className={styles.generatedLink}>Link to share:<br />{shareableUser && `mastodonprofile.web.app/${shareableUser}`}</span>
                <input className={styles.user} type="text" placeholder="Your Mastodon username (including the instance)" value={rawUser}
                       onChange={(ev) => handleUserChange(ev.target.value)}/>
                <input type="button" className={styles.saveButton} value="Copy link" onClick={() => copyShareableLink()} />
                <span className={styles.clipboardMsg}>{clipboardMsg}</span>
            </div>
        </div>
    );
}

export default Main;
