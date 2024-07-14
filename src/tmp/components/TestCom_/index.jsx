const isPub = process.env.NODE_ENV === "production"

// 嵌套层级
let layoutLevel = 0

export default function TestCom_(props) {
  return null
  if(isPub) return null;
    return (<div style={{bottom: props.offset||'0'}} className="fixed-to-b">
      <p className="">Layout嵌套层级: {layoutLevel++}</p> 
      {/* {props.analytics}
      {props.team} */}
      </div>)
}
