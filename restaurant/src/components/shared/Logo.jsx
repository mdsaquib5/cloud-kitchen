import Link from "next/link";
import Image from "next/image";

const Logo = () => {
    return (
        <div className="logo">
            <Link href="/">
                <Image src={'https://pub-863ef00e7a5f45a892803d4befa874c3.r2.dev/home-media/logo-brand.webp'} alt="Your's Kitchen" width={256} height={61} priority />
            </Link>
        </div>
    )
}

export default Logo;