import { useState } from 'react'

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const Statistics = ({ good, neutral, bad, total }) => {
  return (
    <div>
      <h1>statistics</h1>

      {total === 0 ? <p>No feedback given</p> :
        // <>
        //   <StatisticsLine text='good' value={good} />
        //   <StatisticsLine text='neutral' value={neutral} />
        //   <StatisticsLine text='bad' value={bad} />
        //   <StatisticsLine text='average' value={total !== 0 ? (good - bad) / total : 0} />
        //   <StatisticsLine text='positive' value={total !== 0 ? `${(good / total) * 100} %` : 0} />
        // </>
        <>
          <table>
            <tbody>
              <tr>
                <td>good</td>
                <td>{good}</td>
              </tr>
              <tr>
                <td>neutral</td>
                <td>{neutral}</td>
              </tr>
              <tr>
                <td>bad</td>
                <td>{bad}</td>
              </tr>
              <tr>
                <td>average</td>
                <td>{total !== 0 ? (good - bad) / total : 0}</td>
              </tr>
              <tr>
                <td>positive</td>
                <td>{total !== 0 ? `${(good / total) * 100} %` : 0}</td>
              </tr>
            </tbody>
          </table>
        </>
      }
    </div>
  )
}

const StatisticsLine = ({ text, value }) => {
  return (
    <p>{text} {value}</p>
  )
}

function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
    setTotal(total + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
    setTotal(total + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
    setTotal(total + 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleGoodClick} text='good' />
      <Button onClick={handleNeutralClick} text='neutral' />
      <Button onClick={handleBadClick} text='bad' />

      <Statistics good={good} neutral={neutral} bad={bad} total={total} />
    </div>
  )
}

export default App
