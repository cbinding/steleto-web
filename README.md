# steleto-web

A rework of the STELETO application to run in the browser environment with no user installation or configuration necessary. Deployed as a GitHub 'pages' site.
This is a versatile template-driven data conversion application incorporating the [LIQUIDJS template engine](https://liquidjs.com/), intended to be compatible with templates created for the [Shopify LIQUID](https://shopify.dev/docs/api/liquid) implementation. Some source code included here may be derived from work already in the public domain. Where this is the case it will be indicated in comments in the source code. This work is licensed under the [MIT license](https://mit-license.org/).

STELETO-WEB will convert input data file(s) according to the specified template, and write the result to the output pane. Input data files may be either comma delimited text (CSV), tab-delimited text (TSV/TAB/TXT), or JSON format. You may select more than one input data file. When this is the case, the separate data files will be converted using the chosen template then merged to form the output. Input data is passed in to the template as a property named 'data'; for delimited text formats this will be an array; for JSON it may be either an object or an array.

Example - input data file (myinputdata.csv):

```csv
label, price, quantity
"item 1", 1.50, 24
"item 2", 2.75, 18
"item 3", 3.67, 6
```

OR input data (myinputdata.json):

```json
[
  {
    "label": "item 1",
    "price": 1.5,
    "quantity": 24
  },
  {
    "label": "item 2",
    "price": 2.75,
    "quantity": 18
  },
  {
    "label": "item 3",
    "price": 3.67,
    "quantity": 6
  }
]
```

Template (mytemplate.liquid):

```html
<html>
<body>
{%- comment -%}Example template to create a HTML list of data items{%- endcomment -%}
<table border=1 cellpadding=5>
<thead>
	<tr>
		<th>Label</th>
		<th>Price</th>
		<th>Quantity</th>
		<th>Total</th>
		<th>NET</th>
		<th>VAT</th>
	</tr>
</thead>
<tbody>
{% for row in data %}
{%- assign quantity = row.quantity | default: 1.00 -%}
{%- assign total = row.price | default: 0.00 | times: quantity | round: 2 -%}
<tr>
<td>{{row.label | strip}}</td>
<td>{{row.price | default: 0.00 | times: 100 | divided_by: 100 |  round: 2 | prepend: "£"}}</td>
<td>{{quantity}}</td>
<td>{{total | money | prepend: "£"}}</td>
<td>{{total | divided_by: 120 | times: 100 | money | prepend: "£"}}</td>
<td>{{total | divided_by: 120 | times: 20 | money | prepend: "£"}}</td>
</tr>
{% endfor %}
</tbody>
</table>
</body>
</html>
```

Note: JSON input does not have to be a simple array of objects as in this example,
it may contain nested objects and arrays which can be referenced within the template, e.g.

```
<h1>Prices</h1>
<ul>
{%- for item in data.myobject.myproperty.items -%}
<li>{{ item.label }}{{ item.price.net }}</li>
</ul>
```

Output:
<html>
<body><table border=1 cellpadding=5>
<thead>
	<tr>
		<th>Label</th>
		<th>Price</th>
		<th>Quantity</th>
		<th>Total</th>
		<th>NET</th>
		<th>VAT</th>
	</tr>
</thead>
<tbody>
<tr>
<td>item 1</td>
<td>£1.57</td>
<td> 24</td>
<td>£37.68</td>
<td>£31.4</td>
<td>£6.28</td>
</tr>
<tr>
<td>item 2</td>
<td>£2.75</td>
<td> 18</td>
<td>£49.5</td>
<td>£41.25</td>
<td>£8.25</td>
</tr>
<tr>
<td>item 3</td>
<td>£3.67</td>
<td> 6</td>
<td>£22.02</td>
<td>£18.35</td>
<td>£3.67</td>
</tr>

</tbody>
</table>
</body>
</html>