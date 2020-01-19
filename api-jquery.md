[TOC]

# jQuery

## [Utilities](https://api.jquery.com/category/utilities/)

### .text()

### .each()

### .filter()

### .find()

## [Ajax](https://api.jquery.com/category/ajax/)

### .ajax()

<hr>
    <p>The callback hooks provided by <code>$.ajax()</code> are as follows:</p>
    <ol>
        <li><code>beforeSend</code> callback option is invoked; it receives the <code>jqXHR</code> object and the <code>settings</code> object as parameters.</li>
        <li><code>error</code> callback option is invoked, if the request fails. It receives the <code>jqXHR</code>, a string indicating the error type, and an exception object if applicable. Some built-in errors will provide a string as the exception object: "abort", "timeout", "No Transport".</li>
        <li><code>dataFilter</code> callback option is invoked immediately upon successful receipt of response data. It receives the returned data and the value of <code>dataType</code>, and must return the (possibly altered) data to pass on to <code>success</code>.</li>
        <li><code>success</code> callback option is invoked, if the request succeeds. It receives the returned data, a string containing the success code, and the <code>jqXHR</code> object.</li>
        <li><strong>Promise callbacks</strong> — <code>.done()</code>, <code>.fail()</code>, <code>.always()</code>, and <code>.then()</code> — are invoked, in the order they are registered. </li>
        <li><code>complete</code> callback option fires, when the request finishes, whether in failure or success. It receives the <code>jqXHR</code> object, as well as a string containing the success or error code.</li>
    </ol>
<hr>

### .ajaxComplete()

# jQuery prototype (alias $.fn)

## [Properties](https://api.jquery.com/category/properties/jquery-object-instance-properties/)

### .jquery

### .length / ~~.size()~~

### ~~.selector~~

### ~~.context~~

## [DOM Insertion, Inside](https://api.jquery.com/category/manipulation/dom-insertion-inside/)

### .html()

### .text()

## [Traversing](https://api.jquery.com/category/traversing/)

### [Filtering](https://api.jquery.com/category/traversing/filtering/)

#### .first()

#### .last()

#### .filter()

### Miscellaneous

#### .find()

#### .children()

#### .contents()

#### .each()

# [Selectors](https://api.jquery.com/category/selectors/)

## [Attribute](https://api.jquery.com/category/selectors/attribute-selectors/)

- [attribute]
- [attribute=value]

----
- [attribute\~=value]
- [attribute\*=value]

----
- [attribute|=value]
- [attribute^=value]
- [attribute$=value]

## ~~[jQuery Extensions](https://api.jquery.com/category/selectors/jquery-selector-extensions/)~~

- :first
- :last
- [attribute!=value]
