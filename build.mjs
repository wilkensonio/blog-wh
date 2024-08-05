import cpx from 'cpx';

cpx.copy('client/views/**/*.ejs', 'api/build/views');
cpx.copy('client/admin/**/*.ejs', 'api/build/admin');