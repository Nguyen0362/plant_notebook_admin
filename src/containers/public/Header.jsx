import icons from "../../utils/icons";

const { IoSearch, FaRegBell } = icons

const Header = () => {
  return (
    <header className="header fixed top-0 right-0 z-50 max-w-full bg-white ml-[17.5rem] w-[calc(100%-17.5rem)] transition-all duration-500 ease-in-out [&.close]:ml-[5.3125rem] [&.close]:w-[calc(100%-5.3125rem)]">
      <div className="flex justify-between items-center px-[1.875rem] py-[1.375rem] relative">
        {/* <!-- Header Left (Search) --> */}
        <div className="w-[40%]">
          <form action="#">
            <div className="relative">
              <input
                type="text"
                name="name"
                defaultValue=""
                className="w-full bg-[#f9f9f6] border border-[#f9f9f6] rounded-[0.5rem] py-2 pl-[1.875rem] pr-[4.375rem] text-[calc(0.875rem+2*((100vw-20rem)/(1920-320)))] leading-8 focus:outline-none focus:ring-0 focus:border-[#f9f9f6]"
                placeholder="Search Fastkart .."
              />
              <button className="absolute top-0 right-0 bg-[rgb(255,165,59)] text-white border-none rounded-r-[0.5rem] rounded-l-0 px-[1.125rem] py-4 text-[1.125rem]">
                <IoSearch />
              </button>
            </div>
          </form>
        </div>

        {/* <!-- Header Right (Actions & Profile) --> */}
        <div className="header-right">
          <ul className="flex items-center gap-[0.625rem]">
            {/* <!-- Notification Box --> */}
            <li className="group/msg relative px-2 inline-block text-[1.125rem] cursor-pointer">
              <div className="relative">
                <FaRegBell />
                <span className="absolute -right-1 -top-2.5 bg-[#ff7272] text-white text-[0.6875rem] font-bold px-1 py-0.5 rounded-full animate-[not-link_2.1s_cubic-bezier(0.65,0.815,0.735,0.395)_infinite]">4</span>
              </div>

              {/* <!-- Notification Dropdown --> */}
              <ul className="absolute top-[3.125rem] -right-[1.25rem] w-[18.75rem] bg-white text-[1rem] rounded-[0.3125rem] overflow-hidden shadow-[0_0_1.25rem_rgba(89,102,122,0.1)] translate-y-[1.875rem] opacity-0 invisible transition-all duration-300 ease-linear group-hover/msg:translate-y-0 group-hover/msg:opacity-1 group-hover/msg:visible z-50">
                <li className="relative flex items-center p-5 bg-[#0da487] text-white font-semibold">
                  <i className="fa-regular fa-bell absolute text-[2.8125rem] top-[0.4375rem] -right-[1.0625rem] opacity-15"></i>
                  <h6 className="m-0 text-base font-bold">Notifications</h6>
                </li>
                <li className="pt-2 px-[1.0625rem] pb-0">
                  <p className="mb-2 opacity-60 text-sm">
                    <i className="fa-solid fa-circle mr-2 text-[0.6875rem] text-[var(--font-primary)]"></i>
                    Delivery processing
                    <span className="float-right">10 min.</span>
                  </p>
                </li>
                <li className="pt-2 px-[1.0625rem] pb-0">
                  <p className="mb-2 opacity-60 text-sm">
                    <i className="fa-solid fa-circle mr-2 text-[0.6875rem] text-[var(--font-success)]"></i>
                    Delivery processing
                    <span className="float-right">10 min.</span>
                  </p>
                </li>
                <li className="pt-2 px-[1.0625rem] pb-0">
                  <p className="mb-2 opacity-60 text-sm">
                    <i className="fa-solid fa-circle mr-2 text-[0.6875rem] text-[var(--font-info)]"></i>
                    Delivery processing
                    <span className="float-right">10 min.</span>
                  </p>
                </li>
                <li className="pt-2 px-[1.0625rem] pb-0">
                  <p className="mb-2 opacity-60 text-sm">
                    <i className="fa-solid fa-circle m-0 text-[0.6875rem] text-[var(--font-danger)]"></i>
                    Delivery processing
                    <span className="float-right">10 min.</span>
                  </p>
                </li>
                <li className="text-center border-t border-[#ecf3fa] pb-[0.9375rem] pt-2 px-5">
                  <a href="#" className="flex justify-center items-center px-8 py-2.5 bg-[var(--theme-color)] text-white text-sm font-medium rounded whitespace-nowrap">Check all notification</a>
                </li>
              </ul>
            </li>

            {/* <!-- Mode Toggle --> */}
            <li className="px-2 inline-block text-[1.125rem]">
              <i className="fa-regular fa-moon text-[1.3125rem]"></i>
            </li>

            {/* // <!-- Profile Box --> */}
            <li className="group/profile relative px-2 mr-0 pr-0 inline-block text-[1.125rem] cursor-pointer">
              <div className="flex items-center">
                <img src="/images/users/default-avatar.png" alt="Profile" className="w-10 h-10 rounded-full m-0 object-cover" />
                <div className="ml-[0.9375rem]">
                  <span className="block max-w-[120px] font-semibold text-[0.9375rem] text-[#4a5568] whitespace-nowrap overflow-hidden text-ellipsis">Admin User</span>
                  <p className="text-[0.75rem] leading-normal text-[#4a5568]">
                    Admin
                    <i className="fa-solid fa-angle-down text-[0.75rem]"></i>
                  </p>
                </div>
              </div>

              {/* <!-- Profile Dropdown --> */}
              <ul className="absolute top-[3.25rem] -right-[0.75rem] w-[18.75rem] bg-white text-[0.875rem] px-[0.625rem] py-0 rounded-[0.3125rem] shadow-[0_0_1.25rem_rgba(89,102,122,0.1)] translate-y-[1.875rem] opacity-0 invisible transition-all duration-300 ease-linear group-hover/profile:translate-y-0 group-hover/profile:opacity-1 group-hover/profile:visible z-50">
                <li className="p-[0.625rem] group/item">
                  <a href="javascript:void(0)" onClick={(e) => { e.preventDefault(); console.log("View profile"); }} className="flex items-center gap-[0.625rem] text-[var(--theme-color)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span className="text-[#2c323f] text-sm font-normal transition-colors duration-300 group-hover/item:text-[var(--theme-color)]">My Profile</span>
                  </a>
                </li>
                <li className="p-[0.625rem] group/item">
                  <a href="/admin/user" className="flex items-center gap-[0.625rem] text-[var(--theme-color)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span className="text-[#2c323f] text-sm font-normal transition-colors duration-300 group-hover/item:text-[var(--theme-color)]">Users</span>
                  </a>
                </li>
                <li className="p-[0.625rem] group/item">
                  <a href="/admin/orders" className="flex items-center gap-[0.625rem] text-[var(--theme-color)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-archive">
                      <polyline points="21 8 21 21 3 21 3 8"></polyline>
                      <rect x="1" y="3" width="22" height="5"></rect>
                      <line x1="10" y1="12" x2="14" y2="12"></line>
                    </svg>
                    <span className="text-[#2c323f] text-sm font-normal transition-colors duration-300 group-hover/item:text-[var(--theme-color)]">Orders</span>
                  </a>
                </li>
                <li className="p-[0.625rem] group/item">
                  <a href="/admin/settings/profile" className="flex items-center gap-[0.625rem] text-[var(--theme-color)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-settings">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1 2 2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0a2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    <span className="text-[#2c323f] text-sm font-normal transition-colors duration-300 group-hover/item:text-[var(--theme-color)]">Settings</span>
                  </a>
                </li>
                <li className="p-[0.625rem] group/item">
                  <a href="/Account/Logout" id="btnLogout" className="flex items-center gap-[0.625rem] text-[var(--theme-color)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-log-out">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span className="text-[#2c323f] text-sm font-normal transition-colors duration-300 group-hover/item:text-[var(--theme-color)]">Log out</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}

export default Header