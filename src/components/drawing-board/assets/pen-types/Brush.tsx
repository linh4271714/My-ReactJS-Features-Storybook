const Brush = ({ color = "black" }: { color?: string }) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 63 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_1_4)">
        <path
          d="M56.243 3.12222L59.5668 8.87931C59.8241 9.32493 60.2836 9.54133 60.593 9.36266L61.2973 8.95607C61.6067 8.7774 61.649 8.27131 61.3918 7.82569L58.0679 2.0686C57.8106 1.62298 57.3512 1.40658 57.0417 1.58526L56.3375 1.99184C56.028 2.17051 55.9857 2.6766 56.243 3.12222Z"
          fill="black"
        />
        <path
          d="M9.89849 31.8419L11.5352 34.6768C10.3058 35.5902 8.58562 36.5979 6.32598 37.2482C5.0782 37.6052 3.89619 37.7788 2.85176 37.8584C3.40006 36.9894 4.10737 36.0286 5.03538 35.1003C6.73484 33.3922 8.51678 32.4216 9.89849 31.8419Z"
          fill={color}
        />
        <path
          d="M13.3935 26.2072L11.7912 27.1323L8.73035 31.5056C8.55835 31.7473 8.63134 32.2463 8.8965 32.7056L10.3765 35.269C10.6416 35.7283 11.0373 36.041 11.3326 36.0129L16.6504 35.5488L18.2527 34.6237C18.5113 34.9301 18.8144 35.0827 19.0147 34.967L60.7577 10.8667C61.008 10.7222 60.9863 10.222 60.7088 9.74139L56.1826 1.90169C55.9051 1.42106 55.4828 1.15219 55.2325 1.29673L13.4895 25.397C13.2948 25.5095 13.2697 25.8515 13.4058 26.2286L13.3935 26.2072Z"
          fill="#F7EDE7"
        />
        <path
          d="M16.2697 25.2849L20.3868 32.4158C20.4308 32.4922 20.4169 32.5729 20.3714 32.5991C20.326 32.6254 20.2428 32.5862 20.205 32.5208L16.0817 25.3789C16.0376 25.3026 16.0516 25.2218 16.097 25.1956C16.1425 25.1694 16.2257 25.2086 16.2634 25.274L16.2697 25.2849Z"
          fill={color}
        />
        <path
          d="M13.5739 26.9285L17.5776 33.8632C17.6217 33.9395 17.6077 34.0203 17.5623 34.0465C17.5169 34.0728 17.4337 34.0336 17.3959 33.9681L13.3859 27.0226C13.3418 26.9462 13.3558 26.8655 13.4012 26.8393C13.4466 26.813 13.5298 26.8522 13.5676 26.9176L13.5739 26.9285Z"
          fill={color}
        />
        <path
          d="M23.8325 23.9826L25.4111 26.7169L45.7055 15L44.1268 12.2657L23.8325 23.9826Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_1_4">
          <rect
            width="11.281"
            height="65.8381"
            fill="white"
            transform="translate(5.64048 42.6886) rotate(-120)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Brush;
