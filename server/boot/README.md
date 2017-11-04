
```
The name of the application specific boot scripts should be starting 
with a number 101 onwards.
This is to ensure that the scripts do not interfare with the common scripts order
inside the srvcommon/boot.
```

===========

```
It is recommended to keep a gap of 10 between the boot scripts 
so that we do not have any problem in future if we want to insert 
any new scripts in between.
For example: 101, 111, 121, 131...
```

===========

```
If you really want to add a new script which should be executed in between the
two common scripts as placed in the srvcommon/boot.
Then please put an appropriate number after checking the filenames/numbers 
on the common-scripts.
```
