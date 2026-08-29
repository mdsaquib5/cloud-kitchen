import Link from "next/link";
// import Image from "next/image";

const Logo = () => {
    return (
        <div className="logo">
            <Link href="/" style={{ textDecoration: 'none' }}>
                {/* <Image src="/brand-logo4.png" alt="Your's Kitchen" width={160} height={160} priority /> */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', padding: '2px 0' }}>
                    <span style={{ color: 'white', fontSize: '1.1rem', fontWeight: '800', lineHeight: '1.1', textTransform: 'uppercase', letterSpacing: '1px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Shree Shyaam</span>
                    <span style={{ color: '#e11d48', fontSize: '0.85rem', fontWeight: '700', lineHeight: '1.1', textTransform: 'uppercase', letterSpacing: '1.5px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Food Corner</span>
                </div>
            </Link>
        </div>
    )
}

export default Logo;