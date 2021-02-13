function newElement(tagName, className)
{
    const el = document.createElement(tagName)
    el.className = className
    return el 
}

function Bar(reverse = false)
{
    this.el = newElement('div', 'bar')
}