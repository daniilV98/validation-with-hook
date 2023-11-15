import './App.css';
import {useEffect, useState} from "react";

const useValidation = (value, validations) => {
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const newErrors = {}
    for (const validation in validations) {
      switch (validation) {
        case "minLength":
          newErrors[validation] = value.length < validations[validation]
          break
        case "isEmpty":
          newErrors[validation] = !value
          break
        case "maxLength":
          newErrors[validation] = value.length > validations[validation]
          break
        case "isEmail":
          const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          newErrors[validation] = !re.test(String(value).toLowerCase())
          break
        default:
          break
      }
    }
    setErrors(newErrors)
  }, [value, validations])

  return errors
}

const useInput = (initialValue, validations) => {
  const [value, setValue] = useState(initialValue)
  const [isDirty, setDirty] = useState(false)
  const errors = useValidation(value, validations)

  const onChange = (e) => {
    setValue(e.target.value)
  }

  const onBlur = () => {
    setDirty(true)
  }

  return {
    value,
    onChange,
    onBlur,
    isDirty,
    errors,
    inputValid: !Object.values(errors).some(Boolean),
  }
}

const App = () => {
  const email = useInput('', {isEmpty: true, minLength: 5, isEmail: true})
  const password = useInput('', {isEmpty: true, minLength: 6, maxLength: 16})

  return (
      <div>
        <form>
          <h1>Registration</h1>
          {email.isDirty && email.errors.isEmpty && (
              <div style={{ color: "red" }}>Field can not be empty</div>
          )}
          {email.isDirty && email.errors.minLength && (
              <div style={{ color: "red" }}>Email is too short</div>
          )}
          {email.isDirty && email.errors.isEmail && (
              <div style={{ color: "red" }}>Incorrect email</div>
          )}
          <input
              onChange={(e) => email.onChange(e)}
              onBlur={() => email.onBlur()}
              value={email.value}
              name="email"
              type="text"
              placeholder="Enter your email..."
          />
          {password.isDirty && password.errors.isEmpty && (
              <div style={{ color: "red" }}>Field can not be empty</div>
          )}
          {password.isDirty && password.errors.minLength && (
              <div style={{ color: "red" }}>Password is too short</div>
          )}
          {password.isDirty && password.errors.maxLength && (
              <div style={{ color: "red" }}>Password is too long</div>
          )}
          <input
              onChange={(e) => password.onChange(e)}
              onBlur={() => password.onBlur()}
              value={password.value}
              name="password"
              type="password"
              placeholder="Enter your password..."
          />
          <button
              disabled={!email.inputValid || !password.inputValid}
              type="submit"
          >
            Registration
          </button>
        </form>
      </div>
  )
}

export default App;
