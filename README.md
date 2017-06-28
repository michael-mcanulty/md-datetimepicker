# MdDatetimepicker
A datetime picker for Angular Material2.


<h1>Requirements</h1>

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

 imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    MdDatetimepickerModule
    ...
```

<h1>Usage</h1>

```
<md-input-container>
    <input mdInput [MdDatetimepicker]="picker" hide-time="false" hour="20" minutes="0" placeholder="Choose a date">
		    <button mdSuffix [mdDatetimepickerToggle]="picker"></button>
</md-input-container>
<md-datetimepicker #picker></md-datetimepicker>
```

<h1>Features</h1>

The three attributes provided are optional, you can omit entirely.

- Hide-time

- Default Hours

- Default Minutes


<h1>Demo</h1>
Here is a working <a href="http://components.mikemcanulty.com/">demo</a>
