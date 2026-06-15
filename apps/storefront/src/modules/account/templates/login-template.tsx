"use client"

import { useState } from "react"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"
import ForgotPassword from "@modules/account/components/forgot-password"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
  FORGOT_PASSWORD = "forgot-password",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState<LOGIN_VIEW>(LOGIN_VIEW.SIGN_IN)

  return (
    <div className="flex w-full justify-center bg-brand-50/40 px-4 py-16">
      <div className="w-full max-w-md rounded-large border border-grey-20 bg-white px-8 py-10 shadow-[0_8px_40px_-16px_rgba(0,0,0,0.18)]">
        {currentView === LOGIN_VIEW.SIGN_IN && <Login setCurrentView={setCurrentView} />}
        {currentView === LOGIN_VIEW.REGISTER && <Register setCurrentView={setCurrentView} />}
        {currentView === LOGIN_VIEW.FORGOT_PASSWORD && (
          <ForgotPassword setCurrentView={setCurrentView} />
        )}
      </div>
    </div>
  )
}

export default LoginTemplate
