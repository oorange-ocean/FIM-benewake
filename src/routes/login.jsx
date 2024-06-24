import { ReactComponent as LogoIcon } from '../assets/logos/logo+en.svg'
import { ReactComponent as AppIcon } from '../assets/logos/App.svg'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser, login, logout } from '../api/auth';
import { useAlertContext, useAuthContext } from '../hooks/useCustomContext';
const baseUrl = import.meta.env.VITE_BASE_URL
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime(

        ) + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = "benewake" + name + "=" + (value || "") + expires + "; path=/";
}

function AreCookiesValid(cookies) {
    if (cookies) {
        const hasBenewakeusername = cookies.some(item => item.startsWith("benewakeusername="));
        const hasBenewakeuserType = cookies.some(item => item.startsWith("benewakeuserType="));
        if (hasBenewakeusername && hasBenewakeuserType) {
            return true
        }
        else {
            return false
        }
    }
    else {
        return false
    }
}

function detectBrowserInfo() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isFeishu = /lark/i.test(userAgent);
    return { isFeishu };
}
export default function Login() {

    const { alertError, alertWarning } = useAlertContext()
    const { setAuth } = useAuthContext();
    const navigate = useNavigate()

    useEffect(() => {
        const cookies = document.cookie.split('; ');
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');
        if (AreCookiesValid(cookies)) {
            setAuth({
                username: cookies.find(item => item.startsWith("benewakeusername=")).split("=")[1],
                userType: cookies.find(item => item.startsWith("benewakeuserType=")).split("=")[1]
            })
            navigate("/user")
        }
        const browserInfo = detectBrowserInfo();
        if (browserInfo.isFeishu && (!AreCookiesValid(cookies)) && !code) {
            // 如果是飞书浏览器，触发自动跳转到飞书登录
            window.location.href = `https://open.feishu.cn/open-apis/authen/v1/authorize?app_id=cli_a5e56060a07ad00c&amp;redirect_uri=${baseUrl}/#/callback/feishuLogin`;
        }
        else if (code) {
            // 重定向到 FeishuLogin 路由
            navigate(`/callback/feishuLogin?code=${code}`);
            return;
        }
    }, [])

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleUsernameChange = (e) => { setUsername(e.target.value); };
    const handlePasswordChange = (e) => { setPassword(e.target.value); };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await login({ username, password })
        switch (res.code) {
            case 200:
                setAuth(res.data)
                navigate('/user')
                setCookie("username", res.data.username, 7)
                setCookie("userType", res.data.userType, 7)
                break;
            case 202:
                const cookies = document.cookie.split('; ');
                if (!AreCookiesValid(cookies)) {
                    await logout()
                    await handleSubmit()
                }
                break;
            case 400:
                alertWarning(res.message)
                break;
            default:
                alertError("未知错误，请联系飞书管理员!")
                break;
        }
    };

    const handleForgetPassword = () => {
        alertWarning("请联系飞书管理员!")
    }

    const handleCreateUser = async () => {
        await createUser({ username, password, userType: 1 })
    }
    // if (browserInfo === null) {
    //     return <div>Loading...</div>;
    // }

    // if (browserInfo.isFeishu) {
    //     return <div></div>;
    // }
    return (
        <div id="login-page" className="container">
            <div className="logo-wrapper">
                <LogoIcon className="logo" />
            </div>
            <div className="login-form-wrapper">
                <AppIcon className="app-icon" />
                <form className="login-form" onSubmit={handleSubmit}>
                    {/* <div >
                        <input
                            type="username"
                            id="username"
                            value={username}
                            className='input-container'
                            placeholder='用户名'
                            onChange={handleUsernameChange}
                        />
                    </div>
                    <div >
                        <input
                            type="password"
                            id="password"
                            className='input-container'
                            value={password}
                            placeholder='密码'
                            onChange={handlePasswordChange}
                        />
                        <h1 onClick={handleForgetPassword} className="row forget-password">忘记密码？</h1>
                    </div> */}
                    {/* <button className="login-btn" type="submit">登录</button> */}
                    <a class="col flex-center feishu-wrapper" href={`https://open.feishu.cn/open-apis/authen/v1/authorize?app_id=cli_a5e56060a07ad00c&amp;redirect_uri=${baseUrl}/#/callback/feishuLogin`}><svg width="88" height="88" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg" class="feishu-logo"><path d="M69.2174 49.8742L69.2002 49.9052L69.2191 49.876L69.3411 49.6475L69.2174 49.8742Z" fill="#133C9A"></path><path d="M69.7844 48.8144L69.8171 48.7543L69.8325 48.7217C69.8154 48.7526 69.7999 48.7904 69.7844 48.8144Z" fill="#133C9A"></path><path d="M48.0932 45.2992L48.2433 45.1492C48.3408 45.0516 48.4459 44.9466 48.5509 44.849L48.761 44.6464L49.3838 44.0311L50.2392 43.1982L50.9671 42.4779L51.6499 41.8025L52.3628 41.0972L53.0156 40.4519L53.931 39.5514C54.1036 39.3788 54.2837 39.2138 54.4638 39.0487C54.7939 38.7485 55.1391 38.4559 55.4843 38.1708C55.8069 37.9156 56.1371 37.668 56.4748 37.4279C56.9475 37.0902 57.4352 36.7826 57.9305 36.4824C58.4182 36.1973 58.9209 35.9272 59.4312 35.672C59.9114 35.4394 60.4067 35.2218 60.9094 35.0267C61.187 34.9142 61.4722 34.8166 61.7573 34.7191C61.8999 34.6741 62.0425 34.6215 62.1925 34.5765C60.9244 29.5866 58.6058 24.9343 55.3867 20.9199C54.7639 20.147 53.8185 19.6968 52.828 19.6968H26.5277C26.2576 19.6968 26.0325 19.9144 26.0325 20.192C26.0325 20.3496 26.1075 20.4922 26.2351 20.5897C35.2094 27.1704 42.653 35.627 48.0332 45.3668L48.0932 45.2992Z" fill="#00D6B9"></path><path d="M37.6404 68.448C51.222 68.448 63.0553 60.9518 69.2233 49.8765C69.4409 49.4863 69.651 49.0961 69.8536 48.6984C69.5459 49.2912 69.2008 49.8614 68.8181 50.4017C68.683 50.5893 68.548 50.7769 68.4054 50.9645C68.2253 51.1971 68.0452 51.4147 67.8576 51.6323C67.7076 51.8049 67.5575 51.97 67.3999 52.135C67.0848 52.4652 66.7546 52.7804 66.4094 53.073C66.2143 53.2381 66.0267 53.3957 65.8241 53.5457C65.5915 53.7258 65.3514 53.8984 65.1113 54.056C64.9612 54.161 64.8036 54.2586 64.6461 54.3561C64.4885 54.4537 64.3234 54.5512 64.1508 54.6488C63.8132 54.8364 63.4605 55.0164 63.1078 55.174C62.8002 55.3091 62.485 55.4367 62.1699 55.5567C61.8247 55.6843 61.4795 55.7968 61.1194 55.8944C60.5866 56.0444 60.0538 56.157 59.5061 56.2395C59.1159 56.2996 58.7107 56.3446 58.313 56.3746C57.8928 56.4046 57.4651 56.4121 57.0374 56.4121C56.5646 56.4046 56.0919 56.3746 55.6117 56.3221C55.259 56.2846 54.9063 56.232 54.5537 56.172C54.246 56.1195 53.9384 56.052 53.6307 55.9769C53.4656 55.9394 53.3081 55.8944 53.143 55.8494C52.6928 55.7293 52.2425 55.6017 51.7923 55.4742C51.5672 55.4066 51.3421 55.3466 51.1245 55.2791C50.7868 55.1815 50.4567 55.0765 50.1265 54.9714C49.8564 54.8889 49.5862 54.7988 49.3161 54.7088C49.061 54.6263 48.7984 54.5437 48.5432 54.4537L48.018 54.2736C47.8079 54.1986 47.5903 54.1235 47.3802 54.0485L46.93 53.8834C46.6298 53.7783 46.3297 53.6658 46.037 53.5532C45.8644 53.4857 45.6919 53.4257 45.5193 53.3581C45.2867 53.2681 45.0615 53.1781 44.8289 53.088C44.5888 52.9905 44.3412 52.8929 44.1011 52.7954L43.6283 52.6003L43.0431 52.3602L42.5928 52.1726L42.1276 51.97L41.7224 51.7899L41.3547 51.6248L40.9796 51.4522L40.5969 51.2721L40.1091 51.047L39.5989 50.8069C39.4188 50.7169 39.2387 50.6343 39.0586 50.5443L38.6009 50.3192C30.527 46.2897 23.2409 40.8571 17.0729 34.2689C16.8854 34.0738 16.5777 34.0588 16.3751 34.2464C16.2776 34.3364 16.2175 34.4715 16.2175 34.6065L16.2325 57.8153V59.6987C16.2325 60.7943 16.7728 61.8147 17.6807 62.4225C23.5861 66.3695 30.5345 68.463 37.6404 68.448Z" fill="#3370FF"></path><path d="M77.5524 35.7322C72.9677 33.4886 67.7226 33.0084 62.8077 34.3891C62.5976 34.4491 62.395 34.5091 62.1924 34.5691C62.0499 34.6142 61.9073 34.6592 61.7572 34.7117C61.4721 34.8093 61.1869 34.9143 60.9093 35.0194C60.4066 35.2145 59.9188 35.4321 59.4311 35.6647C58.9208 35.9123 58.4181 36.1824 57.9304 36.4676C57.4276 36.7602 56.9474 37.0754 56.4746 37.413C56.137 37.6531 55.8068 37.9008 55.4842 38.1559C55.1315 38.441 54.7938 38.7262 54.4637 39.0338C54.2836 39.1989 54.111 39.364 53.9309 39.5366L53.0155 40.437L52.3626 41.0823L51.6498 41.7876L50.967 42.463L50.2391 43.1833L49.3912 44.0237L48.7684 44.639L48.5583 44.8416C48.4608 44.9392 48.3557 45.0442 48.2507 45.1418L48.1006 45.2919L47.868 45.5095C47.7779 45.592 47.6954 45.667 47.6053 45.7496C45.3467 47.8281 42.8255 49.6064 40.1167 51.0547L40.6044 51.2798L40.9871 51.4598L41.3623 51.6324L41.73 51.7975L42.1352 51.9776L42.6004 52.1802L43.0506 52.3678L43.6359 52.6079L44.1086 52.803C44.3488 52.9006 44.5964 52.9981 44.8365 53.0956C45.0616 53.1857 45.2942 53.2757 45.5268 53.3658C45.6994 53.4333 45.872 53.4933 46.0446 53.5609C46.3447 53.6734 46.6449 53.7785 46.9375 53.891L47.3877 54.0561C47.5978 54.1311 47.8079 54.2062 48.0255 54.2812L48.5508 54.4613C48.8059 54.5438 49.061 54.6339 49.3237 54.7164C49.5938 54.8065 49.8639 54.889 50.1341 54.9791C50.4642 55.0841 50.8019 55.1817 51.1321 55.2867C51.3572 55.3542 51.5823 55.4218 51.7999 55.4818C52.2501 55.6094 52.7003 55.7369 53.1505 55.857C53.3156 55.902 53.4732 55.9395 53.6383 55.9845C53.9459 56.0596 54.2536 56.1196 54.5612 56.1796C54.9139 56.2397 55.2666 56.2922 55.6192 56.3297C56.0995 56.3822 56.5722 56.4123 57.0449 56.4198C57.4726 56.4273 57.9003 56.4123 58.3205 56.3822C58.7257 56.3522 59.1234 56.3072 59.5136 56.2472C60.0539 56.1646 60.5941 56.0446 61.1269 55.902C61.4796 55.8045 61.8323 55.6919 62.1774 55.5643C62.4926 55.4518 62.8077 55.3242 63.1154 55.1817C63.468 55.0241 63.8207 54.844 64.1584 54.6564C64.3235 54.5664 64.4885 54.4688 64.6536 54.3638C64.8187 54.2662 64.9688 54.1612 65.1188 54.0636C65.359 53.8985 65.5991 53.7335 65.8317 53.5534C66.0343 53.4033 66.2294 53.2457 66.417 53.0806C66.7546 52.788 67.0848 52.4728 67.4 52.1427C67.5575 51.9776 67.7076 51.8125 67.8577 51.6399C68.0453 51.4223 68.2329 51.1972 68.4054 50.9721C68.548 50.792 68.6831 50.6044 68.8181 50.4093C69.1933 49.8691 69.5385 49.3063 69.8461 48.721L70.1988 48.0232L73.3353 41.7726L73.3729 41.6976C74.4084 39.4615 75.819 37.4505 77.5524 35.7322Z" fill="#133C9A"></path></svg>飞书登录</a>
                </form>
            </div>

        </div >
    )
}
