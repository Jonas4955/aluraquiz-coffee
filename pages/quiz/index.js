import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import db from '../../db.json'
import Widget from '../../src/components/Widget'
import QuizBackground from '../../src/components/QuizBackground'
import QuizLogo from '../../src/components/QuizLogo'
import QuizContainer from '../../src/components/QuizContainer'
import AlternativesForm from '../../src/components/AlternativesForm'
import BackLinkArrow from '../../src/components/BackLinkArrow'
import Button from '../../src/components/Button'
import Spinner from '../../src/components/Spinner'

function ResultWidget({ results, name, backToHome }) {
  const quantityHits = results.filter(result => result).length

  return (
    <Widget>
      <Widget.Header>Resultado</Widget.Header>

      <Widget.Content>
        <p>
          {`Você acertou ${quantityHits} perguntas ${name}`}
          {/* {results.reduce((somatoriaAtual, resultAtual) => {
            const isAcerto = resultAtual === true
            return isAcerto ? somatoriaAtual + 1 : somatoriaAtual 
          }, 0)} */}
        </p>
        <ul>
          {results.map((result, index) => {
            const indexQuestion = index + 1
            return (
              <li key={index}>{`#${indexQuestion < 10 ? `0${indexQuestion}` : indexQuestion} Resultado: ${
                result ? 'Acertou' : 'Errou'
              }`}</li>
            )
          })}
        </ul>
        <Button onClick={() => backToHome()}>Voltar para Home</Button>
      </Widget.Content>
    </Widget>
  )
}

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>Carregando...</Widget.Header>

      <Widget.Content>
        <Spinner />
      </Widget.Content>
    </Widget>
  )
}

function QuestionWidget({ question, questionIndex, onSubmit, totalQuestions, addResult }) {
  const [selectedAlternative, setSelectedAlternative] = useState(undefined)
  const [isQuestionSubmited, setIsQuestionSubmited] = useState(false)
  const questionId = `question__${questionIndex}`
  const isCorrect = selectedAlternative === question.answer
  const hasAlternativeSelected = selectedAlternative !== undefined

  return (
    <Widget>
      <Widget.Header>
        <BackLinkArrow href="/" />
        <h3>{`Pergunta ${questionIndex + 1} de ${totalQuestions}`}</h3>
      </Widget.Header>
      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover'
        }}
        src={question.image}
      />
      <Widget.Content>
        <h2>{question.title}</h2>
        <p>{question.description}</p>
        <AlternativesForm
          onSubmit={event => {
            event.preventDefault()
            setIsQuestionSubmited(true)
            setTimeout(() => {
              addResult(isCorrect)
              onSubmit()
              setIsQuestionSubmited(false)
              setSelectedAlternative(undefined)
            }, 3 * 1000)
          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`
            const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR'
            const isSelected = selectedAlternative === alternativeIndex
            return (
              <Widget.Topic
                as="label"
                htmlFor={alternativeId}
                key={alternativeIndex}
                data-selected={isSelected}
                data-status={isQuestionSubmited && alternativeStatus}
              >
                <input
                  // style={{ display: 'none' }}
                  id={alternativeId}
                  name={questionId}
                  onChange={() => setSelectedAlternative(alternativeIndex)}
                  type="radio"
                />
                {alternative}
              </Widget.Topic>
            )
          })}
          <Button type="submit" disabled={!hasAlternativeSelected}>
            Confirmar
          </Button>
          {isQuestionSubmited && isCorrect && <p>Você Acertou!</p>}
          {isQuestionSubmited && !isCorrect && <p>Você Errou!</p>}
        </AlternativesForm>
      </Widget.Content>
    </Widget>
  )
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT'
}

export default function QuizPage() {
  const router = useRouter()
  const {
    query: { name }
  } = router
  const [screenState, setScreenState] = useState(screenStates.LOADING)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [results, setResults] = useState([])
  const questionIndex = currentQuestion
  const totalQuestions = db.questions.length
  const question = db.questions[questionIndex]

  const addResult = result => {
    setResults([...results, result])
  }

  const backToHome = () => {
    router.push('/')
  }

  useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ)
    }, 1 * 1000)
  }, [])

  const handleSubmitQuiz = () => {
    const nextQuestion = questionIndex + 1
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion)
    } else {
      setScreenState(screenStates.RESULT)
    }
  }

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            name={name}
            questionIndex={questionIndex}
            onSubmit={handleSubmitQuiz}
            totalQuestions={totalQuestions}
            addResult={addResult}
          />
        )}

        {screenState === screenStates.LOADING && <LoadingWidget />}

        {screenState === screenStates.RESULT && <ResultWidget results={results} name={name} backToHome={backToHome} />}
      </QuizContainer>
    </QuizBackground>
  )
}
