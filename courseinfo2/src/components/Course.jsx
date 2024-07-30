
const Header = ({name}) => <h1>{name}</h1>

const Part = ({name, exercisses}) => <p>{name} {exercisses}</p>

const Content = ({parts}) => {
  return (
  <>
    {parts.map(part => <Part key={part.id} name={part.name} exercisses={part.exercises}  />)}
  </>
  )
}

const Total = ({parts}) => {
  const total = parts.reduce((sum, part) => sum += part.exercises, 0)
  return <p>total of {total} exercises</p>
}

const Course = ({course}) => {
  
  return (
    <div>
      <Header name={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

export default Course