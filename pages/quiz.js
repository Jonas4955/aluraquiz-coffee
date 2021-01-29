import React from 'react'
import { withRouter } from 'next/router'

function QuizPage({ router: { query } }) {
  return <div>Página de Quiz! Bem vindo {query.name}</div>
}

export default withRouter(QuizPage)
