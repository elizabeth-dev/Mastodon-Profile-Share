import {useParams} from "react-router-dom";
import styles from './Redirect.module.scss'

const FULL_MASTODON_USER_REGEX = /^(?<user>@\w+)@(?<domain>.+)$/;

function Redirect() {
    const params = useParams();

    const preferredInstance = localStorage.getItem("preferredInstance");
    const match = params.user!.match(FULL_MASTODON_USER_REGEX)

    if (!match?.groups?.user || !match?.groups?.domain) {
        return (
            <div className={styles.root}>
                <span className={styles.message}>Invalid Mastodon user</span>
            </div>
        )
    }

    if (preferredInstance) {
        window.location.replace(`https://${preferredInstance}/${match.groups.domain === preferredInstance ? match.groups.user : `${match.groups.user}@${match.groups.domain}`}`)
    } else {
        window.location.replace(`https://${match.groups.domain}/${match.groups.user}`)
    }

    return <></>
}

export default Redirect;
