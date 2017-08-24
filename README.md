# MdDatetimepicker
The Material2 picker extended to include a timepicker and more. 

<h3>Demo</h3>
<a href="http://components.mikemcanulty.com/">http://components.mikemcanulty.com</a>

<h3>Screenshots</h3>
<img src="https://github.com/michael-mcanulty/md-datetimepicker/blob/master/demo.jpg" width="600"/>

<h1>Requirements</h1>

- hammerjs
- angular/material
- angular/forms
- angular/platform-browser
- angular/animations
- rxjs/Subscription


<h1>Installation</h1>


Download

- Download the entire <a href="https://github.com/michael-mcanulty/md-datetimepicker/tree/master/src">src folder</a>. Rename it to 'datetimepicker' and place it in your root 'app' folder.

Or

- Install with npm


```
npm i md-datetimepicker --save
```

Add dependency

```
import { MdDatetimepickerModule } from 'md-datetimepicker';
```

The following modules are required:

```
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';

 imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    MdDatetimepickerModule
   ]
```

<h1>Usage</h1>

```
<md-input-container>
    <input mdInput [MdDatetimepicker]="picker" [date]="now" placeholder="Choose a date">
		    <button mdSuffix [mdDatetimepickerToggle]="picker" [hideTime]="false"></button>
</md-input-container>
<md-datetimepicker #picker [hideTime]="false"></md-datetimepicker>
```

<h1>Input Attributes</h1>

The three following attributes on the HTML<bold>Input</bold>Element are optional; you can omit entirely.

- [date]  --The input [value] and picker date when opened.

- [min] --date

- [max] --date


<h1>Datetimepicker Attributes</h1>

- [hideTime] --datepicker only

<h1>Datetimepicker Toggle Button Attribute</h1>

- [hideTime]  -- Changes icon from datetime to a date only icon

- [color] -- {string} icon fill color

<h1>Demo</h1>
Here is a <a href="http://components.mikemcanulty.com/">demo</a>

<h1>Contact</h1>

michael.mcanulty88@gmail.com<br>
Portland, Oregon<br>

If you find an error or would like something added on and don't have time to do so, please let me know and I will try and help.

Michael
