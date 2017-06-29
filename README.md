# MdDatetimepicker
A datetime picker for Angular Material2.


<h1>Requirements</h1>
- hammerjs
- @angular/material
- @angular/animations
- rxjs/Subscription


<h1>Installation</h1>


Download

- Download the Typescript files from GitHub in the src folder. Create a folder in your app root called datetimepicker.

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
    <input mdInput [MdDatetimepicker]="picker" hide-time="false" hour="20" minutes="0" placeholder="Choose a date">
		    <button mdSuffix [mdDatetimepickerToggle]="picker"></button>
</md-input-container>
<md-datetimepicker #picker [startAt]="startDate"></md-datetimepicker>
```

<h1>Input Attributes</h1>

The three following attributes on the <bold>input</bold> element only are optional; you can omit entirely.

- Hide-time

- Default Hours

- Default Minutes

- min (date)

- max (date)


<h1>Datetimepicker Attributes</h1>

- startAt - This is the date to show when the calendar opens.

<h1>Demo</h1>
Here is a working <a href="http://components.mikemcanulty.com/">demo</a>
