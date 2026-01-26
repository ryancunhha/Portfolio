function Menu({ onClick }) {
    return (
        <button onClick={onClick} className="cursor-pointer flex gap-1 items-center flex-row">☰
            <span className="hidden md:inline font-bold text-sm tracking-tighter">Menu</span>
        </button>
    )
}

export default Menu