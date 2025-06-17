export default function ApplicationLogo(props) {
    return (
        <img
            {...props}
            src="/images/TT-Logo-nobg.png" // Change this to your actual image path
            alt="Application Logo"
            className="h-16 w-auto" // Adjust size as needed
        />
    );
}
