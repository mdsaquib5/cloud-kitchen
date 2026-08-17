import Link from "next/link";
import Image from "next/image";

const Logo = () => {
    return (
        <div className="logo">
            <Link href="/">
                <Image src="/logo.png" alt="Your's Kitchen" width={504} height={197} priority />
            </Link>
        </div>
    )
}

export default Logo;