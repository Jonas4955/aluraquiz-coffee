import React from 'react'
import { ThemeProvider } from 'styled-components'
import QuizScreen from '../../src/screens/Quiz'

export default function QuizDaGalera({ dbExterno }) {
  return (
    <ThemeProvider theme={dbExterno.theme}>
      <QuizScreen externalQuestions={dbExterno.questions} ExternalBg={dbExterno.bg} />
    </ThemeProvider>
  )
}

export async function getServerSideProps(context) {
  const [projectName, githubUser] = context.query.id.split('___')
  const dbExterno = await fetch(`https://${projectName}.${githubUser}.vercel.app/api/db`)
    .then(responseServer => {
      if (responseServer.ok) {
        return responseServer.json()
      }

      throw new Error('Falha ao pegar os Dados')
    })
    .then(respostaConvertidaEmObj => respostaConvertidaEmObj)
    .catch(err => {
      console.error(err)
    })

  return {
    props: {
      dbExterno
    }
  }
}
