export function honeycomb(bgColor: string, lineColor: string) {
  return `
    radial-gradient(circle farthest-side at 0% 50%,${bgColor} 23.5%,rgba(240,166,17,0) 0)21px 30px,
            radial-gradient(circle farthest-side at 0% 50%,${lineColor} 24%,rgba(240,166,17,0) 0)19px 30px,
            linear-gradient(${bgColor} 14%,rgba(240,166,17,0) 0, rgba(240,166,17,0) 85%,${bgColor} 0)0 0,
            linear-gradient(150deg,${bgColor} 24%,${lineColor} 0,${lineColor} 26%,rgba(240,166,17,0) 0,rgba(240,166,17,0) 74%,${lineColor} 0,${lineColor} 76%,${bgColor} 0)0 0,
            linear-gradient(30deg,${bgColor} 24%,${lineColor} 0,${lineColor} 26%,rgba(240,166,17,0) 0,rgba(240,166,17,0) 74%,${lineColor} 0,${lineColor} 76%,${bgColor} 0)0 0,
            linear-gradient(90deg,${lineColor} 2%,${bgColor} 0,${bgColor} 98%,${lineColor} 0%)0 0 ${bgColor};
            background-size: 40px 60px;
            `;
}
