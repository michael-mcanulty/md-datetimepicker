# MdDatetimepicker
A datetime picker for Angular Material2.


<h1>Requirements</h1>
- ```hammerjs```
- ```@angular/material```
- ```@angular/animations```
- ```rxjs/Subscription```


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
		    <button mdSuffix [mdDatetimepickerToggle]="picker"></button>
</md-input-container>
<md-datetimepicker #picker [hideTime]="false"></md-datetimepicker>
```

<h1>Input Attributes</h1>

The three following attributes on the HTML<bold>Input</bold>Element are optional; you can omit entirely.

- [date]  --The input [value] and picker date when opened.

- [min] --date

- [max] --date


<h1>Datetimepicker Attributes</h1>

- [HideTime] --datepicker only


<h1>Demo</h1>
Here is a <a href="http://components.mikemcanulty.com/">demo</a>
