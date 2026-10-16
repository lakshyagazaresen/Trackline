import {
  InteractionStatus,
} from '@azure/msal-browser'

import {
  useMsal,
} from '@azure/msal-react'

import {
  Navigate,
} from 'react-router'

import {
  ArrowRight,
  CheckCircle2,
  Dumbbell,
  Goal,
  ListTodo,
  Sparkles,
  WalletCards,
} from 'lucide-react'

import {
  loginRequest,
} from '../../auth/authConfig'

function LoginPage() {
  const {
    instance,
    accounts,
    inProgress,
  } = useMsal()

  const isSigningIn =
    inProgress !==
    InteractionStatus.None

  if (
    accounts.length > 0 &&
    inProgress ===
      InteractionStatus.None
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  async function handleSignIn() {
    await instance.loginRedirect(
      loginRequest,
    )
  }

  return (
    <main
      className="
        relative
        flex min-h-dvh
        items-center
        justify-center
        overflow-hidden

        bg-slate-950

        px-4
        py-8

        sm:px-6
      "
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-32
          -top-32
          size-80
          rounded-full
          bg-sky-500/10
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-40
          -right-24
          size-96
          rounded-full
          bg-violet-500/10
          blur-3xl
        "
      />

      <div
        className="
          relative
          z-10

          grid
          w-full
          max-w-5xl

          overflow-hidden
          rounded-[2rem]

          border
          border-slate-800

          bg-slate-900/80

          shadow-2xl
          shadow-black/40

          backdrop-blur-xl

          md:grid-cols-[1.15fr_0.85fr]
        "
      >
        {/* Brand / feature panel */}
        <section
          className="
            relative
            overflow-hidden

            border-b
            border-slate-800

            p-7

            sm:p-9

            md:border-b-0
            md:border-r
            md:p-12
          "
        >
          <div
            aria-hidden="true"
            className="
              absolute
              -right-16
              -top-16
              size-52
              rounded-full
              bg-sky-400/10
              blur-2xl
            "
          />

          <div className="relative">
            <div className="flex flex-col items-start gap-6">
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                "
              >
                <div
                  className="
                    flex size-10
                    items-center
                    justify-center
                    rounded-2xl
                    bg-sky-400
                    font-black
                    text-slate-950
                    shadow-lg
                    shadow-sky-400/20
                  "
                >
                  T
                </div>

                <span
                  className="
                    text-lg
                    font-bold
                    tracking-tight
                    text-slate-100
                  "
                >
                  Trackline
                </span>
              </div>

              <div
                className="
                  inline-flex
                  items-center
                  gap-2

                  rounded-full
                  border
                  border-sky-400/20

                  bg-sky-400/10

                  px-3
                  py-1.5

                  text-xs
                  font-medium
                  text-sky-300
                "
              >
                <Sparkles size={14} />

                Your life, less scattered
              </div>
            </div>

            <h1
              className="
                mt-5
                max-w-lg

                text-4xl
                font-black
                tracking-tight
                text-slate-100

                sm:text-5xl
              "
            >
              Keep life
              <span className="text-sky-400">
                {' '}
                moving.
              </span>
            </h1>

            <p
              className="
                mt-5
                max-w-lg

                text-base
                leading-7
                text-slate-400

                sm:text-lg
              "
            >
              Tasks, goals,
              fitness and everything
              else you want to keep
              track of — together in
              one place.
            </p>

            <div
              className="
                mt-8
                flex
                flex-wrap
                gap-2
              "
            >
              <FeaturePill
                icon={
                  <ListTodo
                    size={15}
                  />
                }
                label="Tasks"
              />

              <FeaturePill
                icon={
                  <Goal
                    size={15}
                  />
                }
                label="Goals"
              />

              <FeaturePill
                icon={
                  <Dumbbell
                    size={15}
                  />
                }
                label="Fitness"
              />

              <FeaturePill
                icon={
                  <WalletCards
                    size={15}
                  />
                }
                label="Finance"
              />
            </div>
          </div>
        </section>

        {/* Sign-in panel */}
        <section
          className="
            flex
            items-center

            p-7

            sm:p-9

            md:p-10
          "
        >
          <div className="w-full">
            <div
              className="
                mb-6
                flex size-12
                items-center
                justify-center

                rounded-2xl

                border
                border-slate-700

                bg-slate-800
                text-sky-300
              "
            >
              <CheckCircle2
                size={23}
              />
            </div>

            <h2
              className="
                text-2xl
                font-bold
                tracking-tight
                text-slate-100
              "
            >
              Welcome back
            </h2>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-slate-400
              "
            >
              Sign in to pick up
              where you left off.
            </p>

            <button
              type="button"
              onClick={
                handleSignIn
              }
              disabled={
                isSigningIn
              }
              className="
                group

                mt-8
                flex
                w-full
                items-center
                justify-between

                rounded-2xl

                bg-sky-400

                px-5
                py-4

                text-sm
                font-semibold
                text-slate-950

                shadow-lg
                shadow-sky-400/10

                transition

                hover:-translate-y-0.5
                hover:bg-sky-300
                hover:shadow-xl
                hover:shadow-sky-400/20

                active:translate-y-0
                active:scale-[0.99]

                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <span>
                {isSigningIn
                  ? 'Signing in...'
                  : 'Continue with Microsoft'}
              </span>

              {!isSigningIn && (
                <ArrowRight
                  size={18}
                  className="
                    transition-transform
                    group-hover:translate-x-1
                  "
                />
              )}
            </button>

            <div
              className="
                mt-6
                flex
                items-start
                gap-2.5

                rounded-2xl

                border
                border-slate-800

                bg-slate-950/50

                p-4
              "
            >
              <div
                className="
                  mt-0.5
                  size-2
                  shrink-0
                  rounded-full
                  bg-emerald-400
                "
              />

              <p
                className="
                  text-xs
                  leading-5
                  text-slate-500
                "
              >
                Your Trackline data is
                linked to your account.
              </p>
            </div>

            <p
              className="
                mt-8
                text-center
                text-xs
                text-slate-600
              "
            >
              Trackline · One place for
              the things that matter
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

type FeaturePillProps = {
  icon: React.ReactNode
  label: string
}

function FeaturePill({
  icon,
  label,
}: FeaturePillProps) {
  return (
    <div
      className="
        inline-flex
        items-center
        gap-2

        rounded-full

        border
        border-slate-700

        bg-slate-800/80

        px-3
        py-2

        text-xs
        font-medium
        text-slate-300
      "
    >
      <span className="text-slate-500">
        {icon}
      </span>

      {label}
    </div>
  )
}

export default LoginPage