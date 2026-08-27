import Link from "next/link";
import Image from "next/image";

const Logo = () => {
    return (
        <div className="logo">
            <Link href="/">
                <Image src="/brand-logo4.png" alt="Your's Kitchen" width={160} height={160} priority />
            </Link>
        </div>
    )
}

export default Logo;