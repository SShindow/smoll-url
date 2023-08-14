import React from 'react'
import { nanoid } from 'nanoid'
import { getDatabase, child, ref, set, get } from 'firebase/database'
import { isWebUri } from 'valid-url'
import { OverlayTrigger } from 'react-bootstrap/Tooltip'

class Form extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      longURL: '',
      preferedAlias: '',
      generatedURL: '',
      loading: false,
      errors: [],
      errorsMessage: {},
      toolTipMessage: 'Copy To Clipboard',
    };
  }

  onSubmit = async (event) => {
    // Prevent the page from reloading after form submission
    event.preventDefault();
    this.setState({
      loading: true,
      generatedURL: '',
    })

    // Validate the input the user submitted
    var isFormValid = await this.validateInput()
    if (!isFormValid) {
      return
    }

    // If the user has input a prefered alias then we use it
    // If not, we generate a random alias
    var generatedKey = nanoid(5);
    var generatedURL = "smollurl.com/" + generatedKey

    if (this.state.preferedAlias !== '') {
      generatedKey = this.state.preferedAlias
      generatedURL = "smollurl.com/" + this.state.preferedAlias
    }

    const db = getDatabase();
    set(ref(db, '/' + generatedKey), {

      generatedKey: generatedKey,
      longURL: this.state.longURL,
      preferedAlias: this.state.preferedAlias,
      generatedURL: generatedURL,

    }).then((result) => {

      this.setState({
        generatedURL: generatedURL,
        loading: false,
      })

    }).catch((e) => {
      // Handle error
    })
  }

  // Check if field has an error
  hasError = (key) => {
    return this.state.errors.indexOf(key) !== -1;
  }

  // Save the content of the form as the user is typing!
  handleChange = (e) => {
    const { id, value } = e.target
    this.setState(prevState => ({
      ...prevState,
      [id]: value,
    }))
  }

  validateInput = async () => {
    var errors = [];
    var errorsMessage = this.state.errorsMessage;

    // Validate long URL
    if (this.state.longURL.length === 0){
      errors.push('longURL');
      errorsMessage['longURL'] = 'Please enter a URL';
    } else if (!isWebUri(this.state.longURL)) {
      errors.push('longURL');
      errorsMessage['longURL'] = 'Please enter a valid URL';
    }

    // Validate prefered alias
    if (this.state.preferedAlias !== ''){
      if (this.state.preferedAlias.length > 7){
        errors.push('suggestedAlias');
        errorsMessage['suggestedAlias'] = 'Alias must be less than 7 characters';
      } else if (this.state.preferedAlias.indexOf(' ') >= 0){
        errors.push('suggestedAlias');
        errorsMessage['suggestedAlias'] = 'Alias cannot contain spaces';
      }

      // Check if the prefered alias already exists in DB
      var keyExists = await this.checkKeyExists()

      if (keyExists.exists()){
        errors.push('suggestedAlias');
        errorsMessage['suggestedAlias'] = 'Alias already exists! Please enter another one';
      }
    }

    this.setState({
      errors: errors,
      errorsMessage: errorsMessage,
      loading: false,
    })

    if (errors.length > 0){
      return false
    }

    return true
  }

  checkKeyExists = async () => {
    const dbRef = ref(getDatabase());
    return get(child(dbRef, `/${this.state.preferedAlias}`)).catch((error) =>{
      return false;
    })
  }

  copyToClipboard = () => {
    navigator.clipboard.writeText(this.state.generatedURL)
    this.setState({
      toolTipMessage: 'Copied!',
    })
  }
}

export default Form