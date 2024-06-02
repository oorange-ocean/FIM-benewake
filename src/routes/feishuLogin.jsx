import { ReactComponent as LogoIcon } from '../assets/logos/logo+en.svg'
import { ReactComponent as AppIcon } from '../assets/logos/App.svg'

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser, login, logout } from '../api/auth';
import { useAlertContext, useAuthContext } from '../hooks/useCustomContext';
import axios from 'axios';

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = "benewake" + name + "=" + (value || "") + expires + "; path=/";
}

function AreCookiesValid(cookies) {
  if (cookies) {
    const hasBenewakeusername = cookies.some(item => item.startsWith("benewakeusername="));
    const hasBenewakeuserType = cookies.some(item => item.startsWith("benewakeuserType="));
    if (hasBenewakeusername && hasBenewakeuserType) {
      return true;
    }
    else {
      return false;
    }
  }
  else {
    return false;
  }
}

export default function FeishuLogin() {
  const { alertError, alertWarning } = useAlertContext();
  const { setAuth } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const queryParams = hash.split('?')[1];
    const urlParams = new URLSearchParams(queryParams);
    const code = urlParams.get('code');
    console.log("Code:", code); // 打印获取到的 code 参数
    if (code) {
      axios.get(`/api/benewake/home/codeLogin?code=${code}`)
        .then(response => {
          const res = response.data;
          console.log(res);
          switch (res.code) {
            case 200:
              setAuth(res.data);
              navigate('/user');
              setCookie("username", res.data.username, 7);
              setCookie("userType", res.data.userType, 7);
              break;
            case 202:
              const cookies = document.cookie.split('; ');
              if (!AreCookiesValid(cookies)) {
                // handle the situation if cookies are invalid
              }
              break;
            case 400:
              alertWarning(res.message);
              break;
            default:
              alertError("未知错误，请联系飞书管理员!");
              break;
          }
        })
        .catch(error => {
          alertError("网络错误，请稍后重试！");
        });
    } else {
      alertWarning("缺少登录码，请重新登录！");
      navigate('/login');
    }
  }, [alertError, alertWarning, navigate, setAuth]);

  return (
    <div>正在通过飞书登录...</div>
  );
}
