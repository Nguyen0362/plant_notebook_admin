import { useRef, useState, useEffect } from "react";
import logo from "../../assets/full-white.png"
import useSidebarEffect from '../../utils/sidebarEffect';
import { Link, useLocation } from "react-router-dom";
import { path } from "../../utils/constant";
import { FaHouse, FaStore, FaChevronRight, FaLeaf, FaKey  } from "react-icons/fa6";

const Sidebar = () => {
  const sidebarEffectRef = useRef(null);
  useSidebarEffect(sidebarEffectRef);

  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState({});

  const menuItems = [
    {
      name: "Dashboard",
      icon: FaHouse,
      path: `${path.ADMIN}/${path.DASHBOARD}`,
      isDropdown: false,
    },
    {
      name: "Thư viện cây",
      icon: FaLeaf,
      isDropdown: true,
      subItems: [
        {
          name: "Danh sách cây",
          path: `${path.ADMIN}/${path.LIBRARY_PLANTS}`,
        },
        {
          name: "Thêm cây mới",
          path: `${path.ADMIN}/${path.LIBRARY_PLANTS_ADD}`,
        },
        {
          name: "Yêu cầu duyệt",
          path: `${path.ADMIN}/${path.LIBRARY_PLANTS_PENDING}`,
        },
        {
          name: "Lịch sử duyệt",
          path: `${path.ADMIN}/${path.LIBRARY_PLANTS_HISTORY}`,
        },
        {
          name: "Quản lý danh mục",
          path: `${path.ADMIN}/${path.CATEGORIES}`,
        }
      ]
    },
    {
      name: "Gemini Keys",
      icon: FaKey,
      path: `${path.ADMIN}/${path.GEMINI_KEY}`,
      isDropdown: false,
    }
  ];

  // Auto-open active dropdown on mount/route change
  useEffect(() => {
    menuItems.forEach(item => {
      if (item.isDropdown && item.subItems) {
        const hasActiveChild = item.subItems.some(sub => location.pathname === sub.path);
        if (hasActiveChild) {
          setOpenDropdowns(prev => ({ ...prev, [item.name]: true }));
        }
      }
    });
  }, [location.pathname]);

  const toggleDropdown = (name) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <aside className="sidebar fixed top-0 left-0 z-[99] text-left w-[17.5rem] h-screen bg-gradient-to-br from-[#0da487] via-[#009289] to-[#ffa53b] bg-[length:400%_400%] animate-[gradient_15s_ease_infinite] overflow-hidden transition-all duration-300 ease-in-out group/sidebar shadow-[0_0_1.3125rem_0_rgba(89,102,122,0.1)] [&.close]:w-20 [&.close]:hover:w-[17.5rem]">
      <div ref={sidebarEffectRef} id="sidebarEffect" className="absolute top-0 left-0 w-full h-full opacity-[0.04]"></div>

      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="logo-wrapper relative px-[1.875rem] py-[1.6875rem] block group-[.close]/sidebar:hidden group-[.close]/sidebar:hover:block">
            <a href="#" className="block">
              <img src={logo} alt="Logo" className="max-w-full h-auto w-[70%]" />
            </a>
            <div className="toggle-sidebar absolute top-1/2 right-5 -translate-y-1/2 cursor-pointer flex justify-center items-center w-10 h-10">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[1.375rem] h-[2.0625rem] text-white">
                <path d="M6.75 2.5C9.09721 2.5 11 4.40279 11 6.75V11H6.75C4.40279 11 2.5 9.09721 2.5 6.75C2.5 4.40279 4.40279 2.5 6.75 2.5ZM9 9V6.75C9 5.50736 7.99264 4.5 6.75 4.5C5.50736 4.5 4.5 5.50736 4.5 6.75C4.5 7.99264 5.50736 9 6.75 9H9ZM6.75 13H11V17.25C11 19.5972 9.09721 21.5 6.75 21.5C4.40279 21.5 2.5 19.5972 2.5 17.25C2.5 14.9028 4.40279 13 6.75 13ZM6.75 15C5.50736 15 4.5 16.0074 4.5 17.25C4.5 18.4926 5.50736 19.5 6.75 19.5C7.99264 19.5 9 18.4926 9 17.25V15H6.75ZM17.25 2.5C19.5972 2.5 21.5 4.40279 21.5 6.75C21.5 9.09721 19.5972 11 17.25 11H13V6.75C13 4.40279 14.9028 2.5 17.25 2.5ZM17.25 9C18.4926 9 19.5 7.99264 19.5 6.75C19.5 5.50736 18.4926 4.5 17.25 4.5C16.0074 4.5 15 5.50736 15 6.75V9H17.25ZM13 13H17.25C19.5972 13 21.5 14.9028 21.5 17.25C21.5 19.5972 19.5972 21.5 17.25 21.5C14.9028 21.5 13 19.5972 13 17.25V13ZM15 15V17.25C15 18.4926 16.0074 19.5 17.25 19.5C18.4926 19.5 19.5 18.4926 19.5 17.25C19.5 16.0074 18.4926 15 17.25 15H15Z"></path>
              </svg>
            </div>
          </div>

          <div className="logo-icon-wrapper text-right hidden p-3.5 group-[.close]/sidebar:block group-[.close]/sidebar:hover:hidden">
            <a href="#">
              <img src={logo} alt="Logo Icon" className="max-w-full h-auto" />
            </a>
          </div>

          <nav className="sidebar-main relative z-[99] h-screen mt-5 mb-[1.875rem]">
            <ul className="sidebar-links p-0 m-0 list-none h-[calc(100vh-130px)] overflow-y-auto">
              {menuItems.map((item, index) => {
                const isDropdownOpen = !!openDropdowns[item.name];
                const IconComponent = item.icon;

                if (!item.isDropdown) {
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={index} className="px-[0.9375rem] mb-2">
                      <Link
                        to={item.path}
                        className={`sidebar-link relative flex items-center px-[15px] py-3 rounded-[5px] w-full overflow-hidden transition-all duration-300 ease-in-out ${
                          isActive
                            ? "bg-white/15 text-white font-semibold"
                            : "text-white/90 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <IconComponent className="text-xl mr-[0.625rem]" />
                        <span className="capitalize group-[.close]/sidebar:hidden group-[.close]/sidebar:hover:inline-block">
                          {item.name}
                        </span>
                      </Link>
                    </li>
                  );
                } else {
                  const hasActiveChild = item.subItems.some((sub) => location.pathname === sub.path);
                  const isHighlighted = isDropdownOpen || hasActiveChild;
                  return (
                    <li key={index} className="px-[0.9375rem] mb-2">
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className={`sidebar-link relative flex items-center px-[15px] py-3 rounded-[5px] w-full overflow-hidden transition-all duration-300 ease-in-out text-left cursor-pointer ${
                          isHighlighted
                            ? "bg-white/15 text-white font-semibold"
                            : "text-white/90 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <IconComponent className="text-xl mr-[0.625rem]" />
                        <span className="capitalize group-[.close]/sidebar:hidden group-[.close]/sidebar:hover:inline-block flex-grow">
                          {item.name}
                        </span>
                        <FaChevronRight
                          className={`ml-auto text-sm transition-transform duration-300 group-[.close]/sidebar:hidden group-[.close]/sidebar:hover:inline-block ${
                            isDropdownOpen ? "rotate-90" : ""
                          }`}
                        />
                      </button>

                      <div
                        className={`grid transition-all duration-300 ease-in-out group-[.close]/sidebar:hidden group-[.close]/sidebar:hover:grid ${
                          isDropdownOpen
                            ? "grid-rows-[1fr] opacity-100 mt-1"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <ul className="pl-0 py-1 list-none flex flex-col gap-1">
                            {item.subItems.map((sub, subIdx) => {
                              const isSubActive = location.pathname === sub.path;
                              return (
                                <li key={subIdx}>
                                  <Link
                                    to={sub.path}
                                    className={`relative flex items-center py-2 px-[15px] text-[0.9rem] transition-all duration-300 ease-in-out pl-[42px] ${
                                      isSubActive
                                        ? "text-white font-semibold"
                                        : "text-white/70 hover:text-white"
                                    }`}
                                  >
                                    <span className="mr-2 text-white/80">-</span>
                                    <span>{sub.name}</span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </li>
                  );
                }
              })}
            </ul>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;