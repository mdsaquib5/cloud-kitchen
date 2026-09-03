import Link from "next/link";
import Image from "next/image";

const Logo = () => {
    return (
        <div className="logo">
            <Link href="/">
                <Image src="/logo-brand.webp" alt="Your's Kitchen" width={256} height={61} priority />
            </Link>
        </div>
    )
}

export default Logo;