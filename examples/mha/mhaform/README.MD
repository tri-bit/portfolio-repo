# MHAForm
Two react components: MHAInput and MHAForm used to build [react-bootstrap](https://github.com/react-bootstrap/react-bootstrap) compatible forms in the Magic Horse Auction project.

Example below shows the form validation correctly warning/blocking form submission attempt because of Labeled Input's *required:true* property:

![alt text](https://github.com/tri-bit/portfolio-repo/blob/main/examples/mha/mhaform/media/MHAForm01.png?raw=true "Example")

## Features
- Build form from array of inputs
- Can be filled with initial values
- Validation options

Not every form type supports every type of additional property, validation, etc. I built functionality as it was needed for Magic Horse Auction.

## MHAInput Dependencies
- [Slate](https://github.com/ianstormtaylor/slate) for more complex word processing (MHATextEditor.js)
- [React Widgets](https://github.com/jquense/react-widgets) for Date / Time picker (MHAPicker.js)

## Form Inputs Array Example

```js
const demoFormInputs = [

        { label:'Text Input', description:`I'm some input description.`},
        { label:'Labeled Input', type:'labeledinput', required:true },
        { label:'Form Switch', type:'switch'},
        { label:'Divider', type:'divider'},
        { label:'Test Dropdown', type:'dropdown', options: [
            'Option1',
            'Option2',
            'Option3'
        ]},
        { label:'Slate Text Input', type:'texteditor', characterLimit:500 },
    ];
```

## React Usage Example
```js
{/* ...in react component */}
<MHAForm inputs={demoFormInputs}
            handleSubmit={handleFormSubmit}
            submitLabel="Send Form !"
/>
```
