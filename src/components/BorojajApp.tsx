import { useEffect, useState, type ReactNode } from "react"
import {
  normalizeDigits,
  validWalletNumber,
  validWithdrawal,
  walletProviders,
  withdrawalTotals,
  type WalletProvider,
} from "@/lib/withdrawal"

type Page = "home" | "work" | "earn" | "team" | "profile" | "withdraw"

function Icon({
  name,
  size = 24,
  strokeWidth = 2,
}: {
  name: string
  size?: number
  strokeWidth?: number
}) {
  const paths: Record<string, ReactNode> = {
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h5v-6h4v6h5V10" />
      </>
    ),
    work: (
      <>
        <path d="m4 8 8 4 8-4-8-4-8 4Z" />
        <path d="M4 8v9l8 4 8-4V8M12 12v9" />
      </>
    ),
    chart: (
      <>
        <path d="M5 20v-7M12 20V7M19 20V3" />
      </>
    ),
    handshake: (
      <>
        <path d="m4 11 4-4 4 2 3-2 5 5" />
        <path d="m2 9 4-4 3 2M22 9l-4-4-3 2M7 14l3 3 6-6M11 18l2 2 5-5" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="7" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3 20a6 6 0 0 1 12 0M14 15a5 5 0 0 1 7 4.5" />
      </>
    ),
    wallet: (
      <>
        <path d="M4 6h14a2 2 0 0 1 2 2v11H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h11" />
        <path d="M16 11h6v5h-6a2.5 2.5 0 0 1 0-5Z" />
      </>
    ),
    coins: (
      <>
        <ellipse cx="9" cy="6" rx="5" ry="2.5" />
        <path d="M4 6v5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V6M4 11v5c0 1.4 2.2 2.5 5 2.5 1 0 2-.2 2.8-.5" />
        <path d="M14 11c3 0 5 1 5 2.5V18c0 1.4-2.2 2.5-5 2.5S9 19.4 9 18v-1" />
      </>
    ),
    gift: (
      <>
        <rect x="3" y="9" width="18" height="12" rx="2" />
        <path d="M12 9v12M3 13h18M12 9H8.5a2.5 2.5 0 1 1 2.3-3.5L12 9Zm0 0h3.5a2.5 2.5 0 1 0-2.3-3.5L12 9Z" />
      </>
    ),
    deposit: (
      <>
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M8 7V4h8v3M12 17V10M9 13l3-3 3 3" />
      </>
    ),
    withdraw: (
      <>
        <rect x="3" y="3" width="18" height="14" rx="2" />
        <path d="M8 17v3h8v-3M12 7v7M9 11l3 3 3-3" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12" />
        <path d="m18 6-12 12" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6l4 2" />
      </>
    ),
    target: (
      <>
        <circle cx="11" cy="13" r="8" />
        <circle cx="11" cy="13" r="4" />
        <path d="m13 11 8-8M16 3h5v5" />
      </>
    ),
    cursor: (
      <>
        <path d="M7 3v10M7 8H5a2 2 0 0 0-2 2v3l4 7h8a4 4 0 0 0 4-4v-6a2 2 0 0 0-4 0V8a2 2 0 0 0-4 0V6a2 2 0 0 0-4 0" />
      </>
    ),
    share: (
      <>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
      </>
    ),
    link: (
      <>
        <path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2" />
        <path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2" />
      </>
    ),
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    phone: (
      <>
        <path d="M6 3h4l2 5-3 2a15 15 0 0 0 5 5l2-3 5 2v4c0 1.7-1.3 3-3 3C9.7 21 3 14.3 3 6a3 3 0 0 1 3-3Z" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5M15 12H3" />
        <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
      </>
    ),
  }

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      {paths[name] ?? paths["work"]}
    </svg>
  )
}

function AppHeader({
  page,
  onNotice,
  onProfile,
}: {
  page: Page
  onNotice: () => void
  onProfile: () => void
}) {
  const pageLabel = navItems.find((item) => item.id === page)?.label

  if (page !== "profile") {
    return (
      <header className="page-title-header">
        <h1>{pageLabel}</h1>
      </header>
    )
  }

  return (
    <header className="app-header">

      <button
        aria-label="আমার পরিসর খুলুন"
        className="header-profile"
        onClick={onProfile}
      >
        <span className="avatar">
          <Icon name="user" size={41} strokeWidth={1.7} />
          <i />
        </span>
        <span className="identity">
          <small>{pageLabel}</small>
          <strong>বরজাজ</strong>
          <span>
            <b>আইডি ৫৮৯৯৬৩৮০</b>
            <em>
              <Icon name="shield" size={12} /> বিশিষ্ট স্তর ০
            </em>
          </span>
        </span>
      </button>
      <div className="header-actions">
        <span className="header-balance">
          <small>অ্যাকাউন্ট</small>
          <strong>সক্রিয়</strong>
        </span>
        <button
          className="notice-button"
          aria-label="নোটিফিকেশন"
          onClick={onNotice}
        >
          <Icon name="bell" size={30} />
          <b />
        </button>
      </div>
    </header>
  )
}

const navItems: { id: Page; icon: string; label: string }[] = [
  { id: "home", icon: "home", label: "মূল অফিস" },
  { id: "work", icon: "work", label: "কর্মক্ষেত্র" },
  { id: "earn", icon: "chart", label: "অর্জনের পথ" },
  { id: "team", icon: "handshake", label: "সাফল্যের সঙ্গী" },
  { id: "profile", icon: "user", label: "আমার পরিসর" },
]

function BottomNav({
  page,
  onChange,
}: {
  page: Page
  onChange: (page: Page) => void
}) {
  return (
    <nav className="bottom-nav" aria-label="প্রধান নেভিগেশন">
      {navItems.map((item) => (
        <button
          className={page === item.id ? "active" : ""}
          key={item.id}
          onClick={() => onChange(item.id)}
        >
          <Icon name={item.icon} size={27} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

type DashboardTransaction = {
  id: number
  label: string
  amount: number
  type: "credit" | "debit"
  date: string
}

type FixedDeposit = {
  principal: number
  profitRate: number
  profit: number
  maturityAmount: number
  startedAt: string
  expiresAt: string
  maturesAt: number
}

function HomePage({
  action,
  balance,
  investment,
  transactions,
  onDeposit,
  onWithdraw,
  onNavigate,
  onPurchase,
}: {
  action: (message: string) => void
  balance: number
  investment: ActiveInvestment | null
  transactions: DashboardTransaction[]
  onDeposit: (amount: number) => void
  onWithdraw: (amount: number) => void
  onNavigate: (page: Page) => void
  onPurchase: (selectedPackage: VipPackage) => void
}) {
  const [moneyAction, setMoneyAction] = useState<"deposit" | "withdraw" | null>(
    null,
  )
  const [amount, setAmount] = useState(500)
  const dailyProfit = investment
    ? (investment.amount * investment.package.dailyRate) / 100
    : 0
  const totalDeposited = transactions
    .filter((item) => item.type === "credit")
    .reduce((total, item) => total + item.amount, 0)
  const totalWithdrawn = transactions
    .filter(
      (item) => item.type === "debit" && item.label.includes("উত্তোলন"),
    )
    .reduce((total, item) => total + item.amount, 0)

  const submitMoneyAction = () => {
    if (!moneyAction || amount <= 0) {
      action("সঠিক অঙ্ক লিখুন")
      return
    }
    if (moneyAction === "withdraw" && amount > balance) {
      action("পর্যাপ্ত সঞ্চয় নেই")
      return
    }

    if (moneyAction === "deposit") {
      onDeposit(amount)
    } else {
      onWithdraw(amount)
    }
    setMoneyAction(null)
    setAmount(500)
  }

  return (
    <>
      <main className="home-page office-page page-content">
        <section className="office-hero">
          <div className="office-welcome">
            <span>আপনার মূল অফিস</span>
            <h1>স্বাগতম, বরজাজ</h1>
            <p>সব হিসাব একসাথে</p>
          </div>
          <div className="office-balance">
            <span>
              <Icon name="wallet" size={26} />
            </span>
            <div>
              <small>ব্যবহারযোগ্য সঞ্চয়</small>
              <strong>{money(balance)}</strong>
            </div>
          </div>
          <div className="office-vip-pill">
            <Icon name={investment ? "check" : "clock"} size={16} />
            {investment ? investment.package.name : "প্যাকেজ সক্রিয় নয়"}
          </div>
        </section>

        <section className="office-actions" aria-label="দ্রুত কার্যক্রম">
          {[
            ["deposit", "সঞ্চয় জমা", () => setMoneyAction("deposit")],
            ["withdraw", "অর্থ উত্তোলন", () => onNavigate("withdraw")],
            ["chart", "প্যাকেজ কিনুন", () => onNavigate("earn")],
            ["work", "কর্মক্ষেত্র", () => onNavigate("work")],
          ].map(([icon, label, onClick]) => (
            <button key={label as string} onClick={onClick as () => void}>
              <span>
                <Icon name={icon as string} size={26} />
              </span>
              <b>{label as string}</b>
            </button>
          ))}
        </section>

        {(() => {
          const pkg = investment
            ? investment.package
            : [...vipPackages].reverse().find((item) => balance >= item.price) ?? vipPackages[0]!
          const pkgIndex = vipPackages.findIndex((item) => item.name === pkg.name)
          return (
            <article
              className={
                investment ? "tier-package-card" : "tier-package-card suggested-package"
              }
            >
              <div className="tier-package-head">
                <div className="package-number">{bengaliNumber(pkgIndex)}</div>
                <div className="package-name">
                  <span>{pkg.name}</span>
                  <small>{investment ? "সক্রিয় প্যাকেজ" : "প্রস্তাবিত প্যাকেজ"}</small>
                </div>
                {!investment && <b className="tier-package-tag">সেরা পছন্দ</b>}
              </div>
              <div className="tier-package-metrics">
                <div>
                  <small>{investment ? "রোপিত পুঁজি" : "প্যাকেজ মূল্য"}</small>
                  <strong>{money(investment ? investment.amount : pkg.price)}</strong>
                </div>
                <div>
                  <small>দৈনিক লাভ</small>
                  <strong>{bengaliNumber(pkg.dailyRate)}%</strong>
                </div>
                <div>
                  <small>{investment ? "মেয়াদ ফুরোবে" : "মেয়াদ"}</small>
                  <strong>
                    {investment ? investment.expiresAt : `${bengaliNumber(pkg.durationDays)} দিন`}
                  </strong>
                </div>
              </div>
              {investment ? (
                <button onClick={() => onNavigate("work")}>বিস্তারিত</button>
              ) : (
                <button
                  onClick={() => {
                    if (balance < pkg.price) {
                      action("পর্যাপ্ত সঞ্চয় নেই")
                      return
                    }
                    onPurchase(pkg)
                  }}
                >
                  প্যাকেজ কিনুন
                </button>
              )}
            </article>
          )
        })()}

        <section className="office-tools">
          {[
            ["users", "সাফল্যের সঙ্গী", "দল ও কমিশন", "team"],
            ["bell", "বার্তা ও ঘোষণা", "নতুন ঘোষণা নেই", null],
            ["settings", "নিরাপত্তা ও বিন্যাস", "সুরক্ষা যাচাই করুন", null],
          ].map(([icon, title, subtitle, destination]) => (
            <button
              key={title}
              onClick={() =>
                destination
                  ? onNavigate(destination as Page)
                  : action(`${title} শীঘ্রই আসছে`)
              }
            >
              <span>
                <Icon name={icon as string} size={21} />
              </span>
              <div>
                <strong>{title}</strong>
                <small>{subtitle}</small>
              </div>
              <b>›</b>
            </button>
          ))}
        </section>
      </main>

      {moneyAction && (
        <div
          className="purchase-modal-backdrop"
          onClick={() => setMoneyAction(null)}
        >
          <section
            aria-modal="true"
            className="purchase-modal office-money-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="purchase-modal-head">
              <div>
                <span>
                  <Icon
                    name={moneyAction === "deposit" ? "deposit" : "withdraw"}
                    size={22}
                  />
                </span>
                <div>
                  <small>নিরাপদ হিসাব কার্যক্রম</small>
                  <h2>
                    {moneyAction === "deposit"
                      ? "সঞ্চয় জমা করুন"
                      : "অর্থ উত্তোলন করুন"}
                  </h2>
                </div>
              </div>
              <button
                aria-label="বন্ধ করুন"
                onClick={() => setMoneyAction(null)}
              >
                <Icon name="close" size={20} />
              </button>
            </div>
            <div className="office-current-balance">
              <small>বর্তমান ব্যবহারযোগ্য সঞ্চয়</small>
              <strong>{money(balance)}</strong>
            </div>
            <label className="office-amount-field">
              <span>অঙ্ক লিখুন</span>
              <div>
                <b>৳</b>
                <input
                  inputMode="numeric"
                  onChange={(event) =>
                    setAmount(parseBengaliNumber(event.target.value))
                  }
                  type="text"
                  value={toBengaliDigits(amount)}
                />
              </div>
            </label>
            <div className="office-amount-presets">
              {[500, 1000, 2500].map((preset) => (
                <button key={preset} onClick={() => setAmount(preset)}>
                  {money(preset)}
                </button>
              ))}
            </div>
            <div className="purchase-actions">
              <button className="cancel" onClick={() => setMoneyAction(null)}>
                বাতিল করুন
              </button>
              <button className="confirm" onClick={submitMoneyAction}>
                {moneyAction === "deposit"
                  ? "জমা নিশ্চিত করুন"
                  : "উত্তোলন নিশ্চিত করুন"}
              </button>
            </div>
          </section>
        </div>
      )}

    </>
  )
}

function WorkPage({
  action,
  balance,
  investment,
  fixedDeposit,
  transactions,
  onExplore,
  onFixedDeposit,
}: {
  action: (message: string) => void
  balance: number
  investment: ActiveInvestment | null
  fixedDeposit: FixedDeposit | null
  transactions: DashboardTransaction[]
  onExplore: () => void
  onFixedDeposit: () => void
}) {
  const [showFixedDeposit, setShowFixedDeposit] = useState(false)

  const confirmFixedDeposit = () => {
    if (balance <= 0) {
      action("সঞ্চয় নেই")
      return
    }
    onFixedDeposit()
    setShowFixedDeposit(false)
  }

  const dailyRate = investment ? investment.package.dailyRate / 100 : 0
  const dailyRows = investment
    ? Array.from({ length: investment.package.durationDays }, (_, index) => {
        const openingBalance =
          investment.amount * Math.pow(1 + dailyRate, index)
        const profit = openingBalance * dailyRate
        return {
          day: index + 1,
          openingBalance,
          profit,
          closingBalance: openingBalance + profit,
        }
      })
    : []
  const firstDayProfit = dailyRows[0]?.profit ?? 0
  const termProfit = investment
    ? investment.amount *
        Math.pow(1 + dailyRate, investment.package.durationDays) -
      investment.amount
    : 0
  const fixedDepositHistory = transactions.filter((item) =>
    item.label.includes("স্থির সঞ্চয়"),
  )

  return (
    <main className="earn-page work-investment-page page-content">
      <section className="earn-hero">
        <div className="earn-hero-icon">
          <Icon name="work" size={38} />
        </div>
        <div>
          <span className="earn-kicker">দৈনিক আয়</span>
          <h1>আপনার কর্মক্ষেত্র</h1>
          <p>প্যাকেজের দৈনিক হিসাব</p>
        </div>
        <div className="earn-overview">
          <div>
            <small>সক্রিয় প্যাকেজ</small>
            <strong>{investment ? investment.package.name : "এখনও নেই"}</strong>
          </div>
          <div>
            <small>দৈনিক লাভ</small>
            <strong>{investment ? money(firstDayProfit) : money(0)}</strong>
          </div>
        </div>
      </section>

      <section className="work-savings-card">
        <div className="package-heading">
          <div>
            <span>
              <Icon name="shield" size={21} />
            </span>
            <div>
              <h2>২% নিশ্চিত লাভ</h2>
              <p>সঞ্চয়ের মেয়াদি হিসাব</p>
            </div>
          </div>
          <b>{fixedDeposit ? "চলমান" : "ইতিহাস"}</b>
        </div>

        {fixedDeposit ? (
          <article className="work-savings-active">
            <div className="work-savings-status">
              <span>
                <Icon name="check" size={24} />
              </span>
              <div>
                <small>৭ দিনের সঞ্চয়</small>
                <strong>সঞ্চয় নিরাপদে আবদ্ধ</strong>
                <p>শুরুর দিন {fixedDeposit.startedAt}</p>
              </div>
            </div>
            <div className="work-savings-metrics">
              <div>
                <small>আবদ্ধ মূলধন</small>
                <strong>{money(fixedDeposit.principal)}</strong>
              </div>
              <div>
                <small>নিশ্চিত লাভ</small>
                <strong>+ {money(fixedDeposit.profit)}</strong>
              </div>
              <div>
                <small>মেয়াদশেষে মোট</small>
                <strong>{money(fixedDeposit.maturityAmount)}</strong>
              </div>
              <div>
                <small>মেয়াদ ফুরোবে</small>
                <strong>{fixedDeposit.expiresAt}</strong>
              </div>
            </div>
          </article>
        ) : (
          <div className="work-savings-empty">
            <Icon name="calendar" size={30} />
            <div>
              <strong>স্থির সঞ্চয় নেই</strong>
              <p>সাপ্তাহিক ২% লাভ</p>
            </div>
            <button onClick={() => setShowFixedDeposit(true)}>
              বিস্তারিত দেখুন
            </button>
          </div>
        )}

        {fixedDepositHistory.length > 0 && (
          <div className="work-savings-history">
            <div className="work-history-title">
              <h3>সঞ্চয় ইতিহাস</h3>
              <span>{bengaliNumber(fixedDepositHistory.length)}টি রেকর্ড</span>
            </div>
            {fixedDepositHistory.map((item) => (
              <article key={item.id}>
                <span className={item.type}>
                  <Icon
                    name={item.type === "credit" ? "deposit" : "lock"}
                    size={19}
                  />
                </span>
                <div>
                  <strong>{item.label}</strong>
                  <small>{item.date}</small>
                </div>
                <b className={item.type}>
                  {item.type === "credit" ? "+" : "−"} {money(item.amount)}
                </b>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="package-section">
        <div className="package-heading">
          <div>
            <span>
              <Icon name="wallet" size={21} />
            </span>
            <div>
                <h2>সক্রিয় প্যাকেজ</h2>
              <p>পুঁজি ও লাভ</p>
            </div>
          </div>
          {investment && <b>চলমান</b>}
        </div>

        {investment ? (
          <>
            <article className="active-package-card">
              <div className="active-package-head">
                <span>
                  <Icon name="check" size={21} />
                </span>
                <div>
                  <h3>{investment.package.name}</h3>
                  <small>
                    {bengaliNumber(investment.package.durationDays)} দিনের মেয়াদ
                  </small>
                </div>
                <b>সক্রিয়</b>
              </div>
              <div className="active-package-metrics">
              {[
                ["প্যাকেজ মূল্য", money(investment.amount)],
                [
                  "দৈনিক হার",
                  `${bengaliNumber(investment.package.dailyRate)}%`,
                ],
                ["দৈনিক লাভ", money(firstDayProfit)],
                ["মোট লাভ", money(termProfit)],
              ].map(([label, value]) => (
                <div key={label}>
                  <small>{label}</small>
                  <strong>{value}</strong>
                </div>
              ))}
              </div>
              <div className="active-package-dates">
                <div>
                  <small>শুরুর তারিখ</small>
                  <strong>{investment.startedAt}</strong>
                </div>
                <div>
                  <small>শেষ তারিখ</small>
                  <strong>{investment.expiresAt}</strong>
                </div>
              </div>
            </article>
          </>
        ) : (
          <div className="investment-empty">
            <span>
              <Icon name="work" size={42} />
            </span>
            <h2>প্যাকেজ সক্রিয় নয়</h2>
            <p>প্যাকেজ বেছে নিন</p>
            <button onClick={onExplore}>প্যাকেজ বেছে নিন</button>
          </div>
        )}
      </section>

      {investment && (
        <section className="daily-ledger">
          <div className="package-heading">
            <div>
              <span>
                <Icon name="calendar" size={21} />
              </span>
              <div>
                <h2>দৈনিক লাভের হিসাব</h2>
                <p>লাভ ও ব্যালেন্স</p>
              </div>
            </div>
            <b>দৈনিক</b>
          </div>
          <div className="daily-profit-list">
            {dailyRows.map((row, index) => (
              <article key={row.day}>
                <span>{bengaliNumber(index + 1)}</span>
                <div>
                  <strong>
                    {bengaliNumber(row.day)}তম দিনের লাভ
                  </strong>
                  <small>
                    {money(row.openingBalance)} → {money(row.closingBalance)}
                  </small>
                </div>
                <b>+ {money(row.profit)}</b>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="earn-note">
        <span>
          <Icon name="check" size={20} />
        </span>
        <div>
          <h2>হিসাবের নিয়ম</h2>
          <p>দৈনিক চক্রবৃদ্ধি হিসাব</p>
        </div>
      </section>

      {showFixedDeposit && !fixedDeposit && (
        <div
          className="purchase-modal-backdrop"
          onClick={() => setShowFixedDeposit(false)}
        >
          <section
            aria-modal="true"
            className="purchase-modal fixed-deposit-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="purchase-modal-head">
              <div>
                <span>
                  <Icon name="calendar" size={22} />
                </span>
                <div>
                  <small>৭ দিনের সঞ্চয়</small>
                  <h2>সঞ্চয় স্থির করুন</h2>
                </div>
              </div>
              <button
                aria-label="বন্ধ করুন"
                onClick={() => setShowFixedDeposit(false)}
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="fixed-deposit-balance">
              <small>আবদ্ধ হবে</small>
              <strong>{money(balance)}</strong>
              <span>সম্পূর্ণ সঞ্চয়</span>
            </div>

            <div className="fixed-deposit-projection">
              <div>
                <small>সাত দিনে লাভ</small>
                <strong>{money(balance * 0.02)}</strong>
              </div>
              <div>
                <small>মেয়াদশেষে মোট প্রাপ্য</small>
                <strong>{money(balance * 1.02)}</strong>
              </div>
              <div>
                <small>মেয়াদ ফুরোনোর দিন</small>
                <strong>{expiryDateFromToday(7)}</strong>
              </div>
            </div>

            <div className="fixed-deposit-rules">
              <h3>স্থির সঞ্চয়ের নিয়মাবলি</h3>
              <ol>
              <li>সঞ্চয় আবদ্ধ হবে</li>
              <li>আগে উত্তোলন নয়</li>
              <li>২% লাভ যুক্ত</li>
              <li>নতুন জমা উত্তোলনযোগ্য</li>
              <li>পরে বাতিল নয়</li>
              </ol>
            </div>

            <div className="purchase-actions">
              <button
                className="cancel"
                onClick={() => setShowFixedDeposit(false)}
              >
                এখন নয়
              </button>
              <button
                className="confirm"
                disabled={balance <= 0}
                onClick={confirmFixedDeposit}
              >
                সঞ্চয় স্থির করুন
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

const vipPackages = [
  {
    name: "ভিআইপি ০",
    price: 500,
    dailyRate: 0.8,
    durationDays: 5,
  },
  {
    name: "ভিআইপি ১",
    price: 1500,
    dailyRate: 1,
    durationDays: 10,
  },
  {
    name: "ভিআইপি ২",
    price: 5000,
    dailyRate: 1.2,
    durationDays: 20,
  },
  {
    name: "ভিআইপি ৩",
    price: 10000,
    dailyRate: 1.4,
    durationDays: 30,
  },
  {
    name: "ভিআইপি ৪",
    price: 20000,
    dailyRate: 1.6,
    durationDays: 40,
  },
  {
    name: "ভিআইপি ৫",
    price: 35000,
    dailyRate: 1.8,
    durationDays: 50,
  },
]

type VipPackage = (typeof vipPackages)[number]

type ActiveInvestment = {
  package: VipPackage
  amount: number
  startedAt: string
  expiresAt: string
}

function EarnPage({
  action,
  balance,
  onPurchase,
}: {
  action: (message: string) => void
  balance: number
  onPurchase: (selectedPackage: VipPackage) => void
}) {
  const [selectedPackage, setSelectedPackage] = useState<
    (typeof vipPackages)[number] | null
  >(null)
  const suggestedPackage = [...vipPackages]
    .reverse()
    .find((item) => balance >= item.price)
  const amountError = selectedPackage
    ? balance < selectedPackage.price
      ? "পর্যাপ্ত সঞ্চয় নেই"
      : ""
    : ""
  const selectedExpiry = selectedPackage
    ? expiryDateFromToday(selectedPackage.durationDays)
    : ""

  const openPackage = (item: VipPackage) => {
    setSelectedPackage(item)
  }

  const confirmPurchase = () => {
    if (!selectedPackage) return
    if (amountError) {
      action(amountError)
      return
    }

    onPurchase(selectedPackage)
    setSelectedPackage(null)
  }

  return (
    <>
      <main className="earn-page page-content">
        <section className="earn-hero">
          <div className="earn-hero-icon">
            <Icon name="chart" size={38} />
          </div>
          <div>
            <span className="earn-kicker">বিনিয়োগ পরিকল্পনা</span>
            <h1>আপনার অর্জনের পথ</h1>
            <p>প্যাকেজ বেছে নিন</p>
          </div>
          <div className="earn-overview">
            <div>
              <small>মোট প্যাকেজ</small>
              <strong>৬টি</strong>
            </div>
            <div>
              <small>দৈনিক সম্ভাব্য লাভ</small>
              <strong>০.৮% – ১.৮%</strong>
            </div>
          </div>
        </section>

        <section className="package-section">
          <div className="package-heading">
            <div>
              <span>
                <Icon name="wallet" size={21} />
              </span>
              <div>
                <h2>ভিআইপি প্যাকেজসমূহ</h2>
                <p>মূল্য ও লাভ</p>
              </div>
            </div>
            <b>৬টি স্তর</b>
          </div>

          {suggestedPackage && (
            <div className="package-recommendation">
              <span>
                <Icon name="target" size={20} />
              </span>
              <div>
                <small>প্রস্তাবিত প্যাকেজ</small>
                <strong>{suggestedPackage.name}</strong>
              </div>
            </div>
          )}

          <div className="package-list" aria-label="ভিআইপি প্যাকেজের তালিকা">
            {vipPackages.map((item, index) => (
              <article
                className={
                  suggestedPackage?.name === item.name
                    ? "tier-package-card suggested-package"
                    : "tier-package-card"
                }
                key={item.name}
              >
                <div className="tier-package-head">
                  <div className="package-number">{bengaliNumber(index)}</div>
                  <div className="package-name">
                    <span>{item.name}</span>
                    <small>
                      {suggestedPackage?.name === item.name
                        ? "প্রস্তাবিত প্যাকেজ"
                        : "বিনিয়োগ স্তর"}
                    </small>
                  </div>
                  {suggestedPackage?.name === item.name && (
                    <b className="tier-package-tag">সেরা পছন্দ</b>
                  )}
                </div>
                <div className="tier-package-metrics">
                  <div>
                    <small>প্যাকেজ মূল্য</small>
                    <strong>{money(item.price)}</strong>
                  </div>
                  <div>
                    <small>দৈনিক লাভ</small>
                    <strong>{bengaliNumber(item.dailyRate)}%</strong>
                  </div>
                  <div>
                    <small>মেয়াদ</small>
                    <strong>{bengaliNumber(item.durationDays)} দিন</strong>
                  </div>
                </div>
                <button onClick={() => openPackage(item)}>
                  প্যাকেজ কিনুন
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="earn-note">
          <span>
            <Icon name="check" size={20} />
          </span>
          <div>
            <h2>গুরুত্বপূর্ণ তথ্য</h2>
            <p>লাভ ব্যালেন্সে যুক্ত</p>
          </div>
        </section>
      </main>

      {selectedPackage && (
        <div
          className="purchase-modal-backdrop"
          onClick={() => setSelectedPackage(null)}
        >
          <section
            aria-labelledby="purchase-modal-title"
            aria-modal="true"
            className="purchase-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="purchase-modal-head">
              <div>
                <span>
                  <Icon name="wallet" size={22} />
                </span>
                <div>
                  <small>প্যাকেজ কেনার অনুমোদন</small>
                  <h2 id="purchase-modal-title">{selectedPackage.name}</h2>
                </div>
              </div>
              <button
                aria-label="বন্ধ করুন"
                onClick={() => setSelectedPackage(null)}
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="purchase-package-summary">
              <div>
                <small>প্যাকেজের নির্ধারিত মূল্য</small>
                <strong>{money(selectedPackage.price)}</strong>
              </div>
              <div>
                <small>দৈনিক সম্ভাব্য লাভ</small>
                <strong>
                  {bengaliNumber(selectedPackage.dailyRate)}%
                </strong>
              </div>
              <div>
                <small>প্যাকেজের মেয়াদ</small>
                <strong>
                  {bengaliNumber(selectedPackage.durationDays)} দিন
                </strong>
              </div>
              <div>
                <small>মেয়াদ ফুরোনোর দিন</small>
                <strong>{selectedExpiry}</strong>
              </div>
            </div>

            <div className="purchase-balance">
              <div>
                <span>
                  <Icon name="wallet" size={21} />
                </span>
                <div>
                  <small>আপনার সম্পূর্ণ ব্যালেন্স</small>
                  <strong>{money(balance)}</strong>
                </div>
              </div>
              <div>
                <small>প্যাকেজের নির্ধারিত মূল্য</small>
                <strong>{money(selectedPackage.price)}</strong>
              </div>
            </div>

            {amountError && <p className="balance-warning">{amountError}</p>}

            <div className="purchase-rules">
              <h3>প্যাকেজ কেনার নিয়ম</h3>
              <ol>
                <li>মূল্য কাটা হবে</li>
                <li>প্যাকেজ তাৎক্ষণিক সক্রিয়</li>
                <li>লাভ দৈনিক হিসাব</li>
                <li>মেয়াদে প্যাকেজ শেষ</li>
              </ol>
            </div>

            <div className="purchase-actions">
              <button
                className="cancel"
                onClick={() => setSelectedPackage(null)}
              >
                বাতিল করুন
              </button>
              <button className="confirm" onClick={confirmPurchase}>
                ক্রয় নিশ্চিত করুন
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  )
}

type TeamMember = {
  mobile: string
  id?: string
  vipLevel?: number
  date: string
  deposit: number
  profit: number
  active: boolean
}

const teamRates = { 1: 5, 2: 2, 3: 1 } as const
const teamData: Record<keyof typeof teamRates, {
  title: string
  members: number
  active: number
  teamDeposit: number
  teamProfit: number
  list: TeamMember[]
}> = {
  1: {
    title: "লেভেল ১ দল",
    members: 25,
    active: 18,
    teamDeposit: 52000,
    teamProfit: 4800,
    list: [
      {
        mobile: "০১৭৮***৯০১২",
        date: "২৪ অক্টো, ২০২৬",
        deposit: 5000,
        profit: 250,
        active: true,
      },
      {
        mobile: "০১৮১***৪৫৬৭",
        date: "২২ অক্টো, ২০২৬",
        deposit: 2000,
        profit: 100,
        active: true,
      },
      {
        mobile: "০১৯২***১১২২",
        date: "২০ অক্টো, ২০২৬",
        deposit: 0,
        profit: 0,
        active: false,
      },
      {
        mobile: "০১৫৫***৩৩৪৪",
        date: "১৮ অক্টো, ২০২৬",
        deposit: 10000,
        profit: 500,
        active: true,
      },
    ],
  },
  2: {
    title: "লেভেল ২ দল",
    members: 15,
    active: 10,
    teamDeposit: 34000,
    teamProfit: 2900,
    list: [
      {
        mobile: "০১৬৭***৮৮৯৯",
        date: "২৫ অক্টো, ২০২৬",
        deposit: 3000,
        profit: 150,
        active: true,
      },
      {
        mobile: "০১৭৬***০০১১",
        date: "২১ অক্টো, ২০২৬",
        deposit: 10000,
        profit: 500,
        active: true,
      },
      {
        mobile: "০১৩৩***৭৭৬৬",
        date: "১৯ অক্টো, ২০২৬",
        deposit: 0,
        profit: 0,
        active: false,
      },
    ],
  },
  3: {
    title: "লেভেল ৩ দল",
    members: 8,
    active: 4,
    teamDeposit: 16000,
    teamProfit: 1500,
    list: [
      {
        mobile: "০১৯৯***৫৫৪৪",
        date: "২৬ অক্টো, ২০২৬",
        deposit: 5000,
        profit: 250,
        active: true,
      },
      {
        mobile: "০১৭৪***২৩২৩",
        date: "২৩ অক্টো, ২০২৬",
        deposit: 6318.5,
        profit: 300,
        active: true,
      },
      {
        mobile: "০১৮৮***৯৯০০",
        date: "২০ অক্টো, ২০২৬",
        deposit: 0,
        profit: 0,
        active: false,
      },
    ],
  },
}

const bengaliNumber = (value: number) =>
  value.toLocaleString("bn-BD", { maximumFractionDigits: 1 })

const toBengaliDigits = (value: number) =>
  String(value).replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)] ?? digit)

const parseBengaliNumber = (value: string) => {
  const normalized = value
    .replace(/[০-৯]/g, (digit) => String("০১২৩৪৫৬৭৮৯".indexOf(digit)))
    .replace(/[^\d]/g, "")

  return normalized ? Number(normalized) : 0
}

const money = (value: number) =>
  `৳ ${value.toLocaleString("bn-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

const bengaliDate = (date: Date) =>
  date.toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

const expiryDateFromToday = (durationDays: number) => {
  const expiry = new Date()
  expiry.setDate(expiry.getDate() + durationDays)
  return bengaliDate(expiry)
}

const levelTotals = (level: keyof typeof teamRates) => {
  const data = teamData[level]
  const deposit = (data.teamDeposit * teamRates[level]) / 100
  const profit = (data.teamProfit * teamRates[level]) / 100
  return { deposit, profit, total: deposit + profit }
}

const salaryTiers = [
  { refs: 5, salary: 500 },
  { refs: 10, salary: 1200 },
  { refs: 20, salary: 2500 },
  { refs: 35, salary: 4500 },
  { refs: 50, salary: 7000 },
  { refs: 100, salary: 15000 },
]

function TeamPage({
  action,
  onClaim,
}: {
  action: (message: string) => void
  onClaim: (amount: number) => void
}) {
  const [claimed, setClaimed] = useState<number[]>([])
  const claimSalary = (refs: number, salary: number) => {
    if (claimed.length > 0) return
    setClaimed((current) => [...current, refs])
    onClaim(salary)
    action(`${money(salary)} বেতন ব্যালেন্সে যোগ হয়েছে`)
  }
  const [level, setLevel] = useState<keyof typeof teamRates>(1)
  const [sub, setSub] = useState<null | "members" | "salary">(null)
  const directActive = teamData[1].active
  const data = teamData[level]
  const totals = levelTotals(level)
  const summary = ([1, 2, 3] as const).reduce(
    (result, item) => {
      const itemTotals = levelTotals(item)
      result.deposit += itemTotals.deposit
      result.profit += itemTotals.profit
      result.members += teamData[item].members
      result.active += teamData[item].active
      return result
    },
    { deposit: 0, profit: 0, members: 0, active: 0 },
  )

  const copyText = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const input = document.createElement("input")
      input.value = text
      document.body.appendChild(input)
      input.select()
      document.execCommand("copy")
      input.remove()
    }
    action(message)
  }

  return (
    <main className="team-page page-content">
      {!sub && (
        <>
      <section className="team-summary">
        <div className="team-summary-mark">
          <Icon name="users" size={74} strokeWidth={1.4} />
        </div>
        <div className="team-badges">
          <span>রেফারেল প্রোগ্রাম</span>
          <small>৩ স্তরের দল</small>
        </div>
        <h1>সাফল্যের সঙ্গী</h1>
        <p>আমন্ত্রণে বোনাস পান</p>
        <div className="team-summary-grid main">
          <div>
            <small>মোট রেফার ইনকাম</small>
            <strong className="amber">
              {money(summary.deposit + summary.profit)}
            </strong>
          </div>
          <div>
            <small>মোট সদস্য</small>
            <strong>{bengaliNumber(summary.members)} জন</strong>
          </div>
          <div>
            <small>সক্রিয় সদস্য</small>
            <strong className="green">
              {bengaliNumber(summary.active)} জন
            </strong>
          </div>
          <div>
            <small>ডিপোজিট বোনাস</small>
            <strong>{money(summary.deposit)}</strong>
          </div>
          <div>
            <small>প্রফিট কমিশন</small>
            <strong>{money(summary.profit)}</strong>
          </div>
        </div>
      </section>

      <section className="invite-card team-card">
        <div className="team-card-heading">
          <span>
            <Icon name="share" size={20} />
          </span>
          <div>
            <h2>আমন্ত্রণ লিংক</h2>
            <p>নতুন সদস্য আনুন</p>
          </div>
        </div>
        <label>আমন্ত্রণ কোড</label>
        <div className="copy-field">
          <strong>BOROJAJ8996</strong>
          <button
            onClick={() => copyText("BOROJAJ8996", "কোড কপি হয়েছে")}
          >
            <Icon name="copy" size={15} /> কপি
          </button>
        </div>
        <label>আমন্ত্রণ লিংক</label>
        <div className="copy-field link-field">
          <span>https://borojaj.app/ref/BOROJAJ8996</span>
          <button
            onClick={() =>
              copyText(
                "https://borojaj.app/ref/BOROJAJ8996",
                "লিংক কপি হয়েছে",
              )
            }
          >
            <Icon name="link" size={15} /> কপি লিংক
          </button>
        </div>
      </section>

      <section className="team-links">
        <button className="team-card" onClick={() => setSub("members")}>
          <Icon name="users" size={20} />
          <span>সদস্য ও কমিশন</span>
          <em>›</em>
        </button>
        <button className="team-card" onClick={() => setSub("salary")}>
          <Icon name="wallet" size={20} />
          <span>মাসিক বেতন</span>
          <em>›</em>
        </button>
      </section>
        </>
      )}

      {sub && (
        <button className="sub-back" onClick={() => setSub(null)}>
          ← {sub === "members" ? "সদস্য ও কমিশন" : "মাসিক বেতন"}
        </button>
      )}

      {sub === "members" && (
        <>
      <section className="team-levels">
        <h2>
          <i /> সদস্য ও কমিশন
        </h2>
        <div className="level-tabs">
          {([1, 2, 3] as const).map((item) => (
            <button
              className={level === item ? "active" : ""}
              key={item}
              onClick={() => setLevel(item)}
            >
              লেভেল {bengaliNumber(item)}
              <span>({bengaliNumber(teamRates[item])}%)</span>
            </button>
          ))}
        </div>

        <div className="level-stats team-card">
          <div className="level-stats-head">
            <div>
              <small>
                {data.title} ({bengaliNumber(teamRates[level])}% কমিশন)
              </small>
              <strong>
                সদস্য: {bengaliNumber(data.members)} জন{" "}
                <em>({bengaliNumber(data.active)} জন সক্রিয়)</em>
              </strong>
            </div>
            <div>
              <small>এই লেভেলের আয়</small>
              <strong>{money(totals.total)}</strong>
            </div>
          </div>
          <div className="level-income">
            <div>
              <small>
                <Icon name="wallet" size={13} /> ডিপোজিট বোনাস
              </small>
              <strong>{money(totals.deposit)}</strong>
            </div>
            <div>
              <small>
                <Icon name="chart" size={13} /> প্রফিট কমিশন
              </small>
              <strong>{money(totals.profit)}</strong>
            </div>
          </div>
        </div>

        <div className="referral-list">
          {data.list.map((member) => {
            const bonus = (member.deposit * teamRates[level]) / 100
            const commission = (member.profit * teamRates[level]) / 100
            return (
              <article className="referral-member" key={member.id ?? member.mobile}>
                <header className="referral-member-header">
                  <div className="referral-mobile">
                    <span className="referral-avatar"><Icon name="user" size={18} /></span>
                    <div><span className="referral-label">মোবাইল নম্বর</span><strong>{member.mobile}</strong></div>
                  </div>
                  <span className={`referral-status ${member.active ? "is-active" : ""}`}>
                    <i />{member.active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                  </span>
                </header>
                <dl className="referral-details">
                  <div><dt>সদস্য আইডি</dt><dd>{member.id ?? "তথ্য নেই"}</dd></div>
                  <div><dt>ভিআইপি নম্বর</dt><dd>{member.vipLevel === undefined ? "তথ্য নেই" : `VIP ${bengaliNumber(member.vipLevel)}`}</dd></div>
                  <div><dt>মোট ডিপোজিট</dt><dd>{money(member.deposit)}</dd></div>
                  <div className="referral-earned"><dt>মোট কমিশন</dt><dd>{money(bonus + commission)}</dd></div>
                </dl>
                <footer className="referral-member-footer">
                  <span>ডিপোজিট বোনাস <b>{money(bonus)}</b></span>
                  <span>প্রফিট কমিশন <b>{money(commission)}</b></span>
                  <span className="referral-joined">যোগদান: {member.date}</span>
                </footer>
              </article>
            )
          })}
        </div>
      </section>

      <section className="commission-rules">
        <h2>
          <Icon name="gift" size={17} /> কমিশন হিসাব
        </h2>
        {[
          ["wallet", "ডিপোজিট বোনাস", "বোনাস"],
          ["chart", "দৈনিক কমিশন", "কমিশন"],
        ].map(([icon, title, label]) => (
          <div className="rule-group" key={title}>
            <h3>
              <Icon name={icon ?? ""} size={14} /> {title}
            </h3>
            <div>
              {([1, 2, 3] as const).map((item) => (
                <article key={item}>
                  <strong>
                    {bengaliNumber(teamRates[item])}% {label}
                  </strong>
                  <small>{bengaliNumber(item)}ম লেভেল</small>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
        </>
      )}

      {sub === "salary" && (
        <section className="salary-list">
          <p className="salary-note">
            সক্রিয় সরাসরি রেফারেল: <strong>{bengaliNumber(directActive)} জন</strong>
          </p>
          {salaryTiers.map((tier) => {
            const best = [...salaryTiers].reverse().find((t) => directActive >= t.refs)
            const done = best?.refs === tier.refs
            const passed = !done && directActive >= tier.refs
            return (
              <article
                className={done ? "salary-row team-card done" : "salary-row team-card"}
                key={tier.refs}
              >
                <div>
                  <strong>{bengaliNumber(tier.refs)} রেফারেল</strong>
                  <small>{done ? "অর্জিত" : passed ? "উচ্চ স্তরে উন্নীত" : `আর ${bengaliNumber(tier.refs - directActive)} জন`}</small>
                </div>
                <div className="salary-side">
                  <b>{money(tier.salary)}<small>/মাস</small></b>
                  {done && (
                    <button
                      className="salary-claim"
                      disabled={claimed.length > 0}
                      onClick={() => claimSalary(tier.refs, tier.salary)}
                    >
                      {claimed.length > 0 ? "এই মাসে নেওয়া হয়েছে" : "দাবি করুন"}
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </section>
      )}
    </main>
  )
}

function ProfilePage({
  action,
}: {
  action: (message: string) => void
  balance: number
  fixedDeposit: FixedDeposit | null
  investment: ActiveInvestment | null
  transactions: DashboardTransaction[]
}) {
  const stats = [
    ["coins", "কর্মক্ষেত্রের আয়", "৳ ২,৭২৬.৩৭"],
    ["gift", "দলীয় প্রাপ্ত", "৳ ২৮০.০০"],
    ["users", "দলীয় লভ্যাংশ", "৳ ২৪.৫০"],
    ["chart", "আজকের অর্জন", "৳ ১,৪০০.৭৫"],
    ["gift", "মোট জমা", "৳ ২,৬০০.০০"],
    ["wallet", "মোট উত্তোলন", "৳ ২০০.০০"],
  ]
  const menu = [
    "সাধারণ হিসাবপত্র",
    "জমার অর্ডার",
    "কমিশন",
    "লভ্যাংশ",
    "উত্তোলন",
    "স্টকের মূল্যায়ন",
    "অ্যাপ ডাউনলোড",
  ]

  return (
    <main className="home-page page-content">
      <section className="balance-card">
        <div className="wallet-mark">
          <Icon name="wallet" size={37} />
        </div>
        <div>
          <span>মোট সঞ্চয়</span>
          <strong>৳ ১০২.০৩</strong>
        </div>
      </section>

      <section className="stats-grid">
        {stats.map(([icon, title, value]) => (
          <div className="stat-cell" key={title}>
            <span className="small-icon">
              <Icon name={icon ?? ""} size={23} />
            </span>
            <div>
              <span>{title}</span>
              <strong>{value}</strong>
            </div>
          </div>
        ))}
      </section>

      <section className="quick-grid">
        {[
          ["deposit", "জমা করুন"],
          ["withdraw", "উত্তোলন"],
          ["users", "সঙ্গীগণ"],
          ["settings", "বিন্যাস"],
        ].map(([icon, label]) => (
          <button
            key={label}
            onClick={() => action(`${label} নির্বাচিত হয়েছে`)}
          >
            <span>
              <Icon name={icon ?? ""} size={34} />
            </span>
            <b>{label}</b>
          </button>
        ))}
      </section>

      <section className="menu-list">
        {menu.map((item) => (
          <button key={item} onClick={() => action(`${item} শীঘ্রই আসছে`)}>
            <span>{item}</span>
            <b>›</b>
          </button>
        ))}
      </section>
      <button
        className="chat-button"
        aria-label="সহায়তা"
        onClick={() => action("সহায়তা খোলা হয়েছে")}
      >
        <span>•••</span>
        <b>১</b>
      </button>
    </main>
  )
}

function PlaceholderPage({ page }: { page: Page }) {
  const current = navItems.find((item) => item.id === page)!
  return (
    <main className="placeholder page-content">
      <div>
        <span>
          <Icon name={current.icon} size={54} />
        </span>
        <h1>{current.label}</h1>
        <p>বিভাগ শীঘ্রই আসছে</p>
      </div>
    </main>
  )
}

export default function App() {
  const [page, setPage] = useState<Page>("home")
  const [toast, setToast] = useState("")
  const [balance, setBalance] = useState(2500)
  const [investment, setInvestment] = useState<ActiveInvestment | null>(null)
  const [fixedDeposit, setFixedDeposit] = useState<FixedDeposit | null>(null)
  const [transactions, setTransactions] = useState<DashboardTransaction[]>([
    {
      id: 1,
      label: "প্রারম্ভিক সঞ্চয়",
      amount: 2500,
      type: "credit",
      date: "আজ",
    },
  ])

  useEffect(() => {
    if (!fixedDeposit) return

    const releaseDeposit = () => {
      setBalance((current) => current + fixedDeposit.maturityAmount)
      setTransactions((current) => [
        {
          id: Date.now(),
          label: "স্থির সঞ্চয়ের মেয়াদপূর্তি",
          amount: fixedDeposit.maturityAmount,
          type: "credit",
          date: bengaliDate(new Date()),
        },
        ...current,
      ])
      setFixedDeposit(null)
      showToast("লাভ সঞ্চয়ে যুক্ত")
    }

    const remaining = fixedDeposit.maturesAt - Date.now()
    if (remaining <= 0) {
      releaseDeposit()
      return
    }

    const timer = window.setTimeout(releaseDeposit, remaining)
    return () => window.clearTimeout(timer)
  }, [fixedDeposit])

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(""), 2200)
  }

  const changePage = (next: Page) => {
    setPage(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const addTransaction = (
    label: string,
    amount: number,
    type: DashboardTransaction["type"],
  ) => {
    setTransactions((current) => [
      {
        id: Date.now(),
        label,
        amount,
        type,
        date: bengaliDate(new Date()),
      },
      ...current,
    ])
  }

  const deposit = (amount: number) => {
    setBalance((current) => current + amount)
    addTransaction("সঞ্চয় জমা", amount, "credit")
    showToast(`${money(amount)} জমা হয়েছে`)
  }

  const withdraw = (amount: number) => {
    setBalance((current) => current - amount)
    addTransaction("অর্থ উত্তোলন", amount, "debit")
    showToast(`${money(amount)} উত্তোলন হয়েছে`)
  }

  const activateFixedDeposit = () => {
    if (balance <= 0 || fixedDeposit) return

    const principal = balance
    const profit = principal * 0.02
    setBalance(0)
    setFixedDeposit({
      principal,
      profitRate: 2,
      profit,
      maturityAmount: principal + profit,
      startedAt: bengaliDate(new Date()),
      expiresAt: expiryDateFromToday(7),
      maturesAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    })
    addTransaction("স্থির সঞ্চয় স্থানান্তর", principal, "debit")
    showToast("সঞ্চয় নিরাপদে আবদ্ধ")
  }

  return (
    <div className="app blue-header">
      <AppHeader
        onNotice={() => showToast("নতুন নোটিফিকেশন নেই")}
        onProfile={() => changePage("profile")}
        page={page}
      />
      {page === "home" && (
        <HomePage
          action={showToast}
          balance={balance}
          investment={investment}
          onDeposit={deposit}
          onNavigate={changePage}
          onPurchase={(selectedPackage) => {
            setBalance((current) => current - selectedPackage.price)
            addTransaction(
              `${selectedPackage.name} প্যাকেজ ক্রয়`,
              selectedPackage.price,
              "debit",
            )
            setInvestment({
              package: selectedPackage,
              amount: selectedPackage.price,
              startedAt: bengaliDate(new Date()),
              expiresAt: expiryDateFromToday(selectedPackage.durationDays),
            })
            showToast(`${selectedPackage.name} সক্রিয় হয়েছে`)
            changePage("work")
          }}
          onWithdraw={withdraw}
          transactions={transactions}
        />
      )}
      {page === "work" && (
        <WorkPage
          action={showToast}
          balance={balance}
          fixedDeposit={fixedDeposit}
          investment={investment}
          onExplore={() => changePage("earn")}
          onFixedDeposit={activateFixedDeposit}
          transactions={transactions}
        />
      )}
      {page === "earn" && (
        <EarnPage
          action={showToast}
          balance={balance}
          onPurchase={(selectedPackage) => {
            setBalance((current) => current - selectedPackage.price)
            addTransaction(
              `${selectedPackage.name} প্যাকেজ ক্রয়`,
              selectedPackage.price,
              "debit",
            )
            setInvestment({
              package: selectedPackage,
              amount: selectedPackage.price,
              startedAt: bengaliDate(new Date()),
              expiresAt: expiryDateFromToday(
                selectedPackage.durationDays,
              ),
            })
            showToast(`${selectedPackage.name} সক্রিয় হয়েছে`)
            changePage("work")
          }}
        />
      )}
      {page === "team" && (
        <TeamPage
          action={showToast}
          onClaim={(amount) => setBalance((current) => current + amount)}
        />
      )}
      {page === "profile" && (
        <ProfilePage
          action={showToast}
          balance={balance}
          fixedDeposit={fixedDeposit}
          investment={investment}
          transactions={transactions}
        />
      )}
      {!["home", "work", "earn", "team", "profile"].includes(page) && (
        <PlaceholderPage page={page} />
      )}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
      <BottomNav page={page} onChange={changePage} />
    </div>
  )
}
