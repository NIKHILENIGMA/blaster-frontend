import type { FC, SVGProps } from 'react'

interface LeaderboardIconProps extends SVGProps<SVGSVGElement> {
    size?: number | string
}

const LeaderboardIcon: FC<LeaderboardIconProps> = ({ size = 24, fill = 'none', ...props }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={fill}
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <path
                d="M15.3337 23H8.66699V13.6667C8.66699 13.2984 8.96547 13 9.33366 13H14.667C15.0352 13 15.3337 13.2984 15.3337 13.6667V23Z"
                stroke="currentColor"
                strokeWidth="1.55556"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M21.333 23H15.333V19.7778C15.333 19.4095 15.6315 19.1111 15.9997 19.1111H21.333C21.7012 19.1111 21.9997 19.4095 21.9997 19.7778V22.3333C21.9997 22.7015 21.7012 23 21.333 23Z"
                stroke="currentColor"
                strokeWidth="1.55556"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8.66667 23V17.5556C8.66667 17.1874 8.36819 16.8889 8 16.8889H2.66667C2.29848 16.8889 2 17.1874 2 17.5556V22.3334C2 22.7016 2.29848 23 2.66667 23H8.66667Z"
                stroke="currentColor"
                strokeWidth="1.55556"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10.8056 4.11325L11.7147 2.1856C11.8314 1.93813 12.1686 1.93813 12.2853 2.1856L13.1944 4.11325L15.2275 4.42427C15.4884 4.46418 15.5923 4.79977 15.4035 4.99229L13.9326 6.4917L14.2797 8.60999C14.3243 8.88202 14.0515 9.0895 13.8181 8.96099L12 7.96031L10.1819 8.96099C9.94851 9.0895 9.67568 8.88202 9.72026 8.60999L10.0674 6.4917L8.59651 4.99229C8.40766 4.79977 8.51163 4.46418 8.77248 4.42427L10.8056 4.11325Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default LeaderboardIcon
