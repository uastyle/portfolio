var gulp       	 = require('gulp'), // Підключаємо Gulp
		browserSync  = require('browser-sync'), // Підключаємо Browser Sync
		sass         = require('gulp-sass'), // Підключаємо Sass пакет,
		concat       = require('gulp-concat'), // Підключаємо gulp-concat (для конкатенації (що це?) файлів)
		uglify       = require('gulp-uglifyjs'), // Підключаємо gulp-uglifyjs (для стиснення JS)
		cssnano      = require('gulp-cssnano'), // Підключаємо пакет для мініфікаціі CSS
		rename       = require('gulp-rename'), // Підключаємо бібліотеку для перейменуванняя файлів
		del          = require('del'), // Підключаємо бібліотеку для видалення файлів і тек
		imagemin     = require('gulp-imagemin'), // Підключаємо бібліотеку для роботи із зображеннями
		pngquant     = require('imagemin-pngquant'), // Підключаємо бібліотеку для роботи з png
		cache        = require('gulp-cache'), // Підключаємо бібліотеку кешування
		autoprefixer = require('gulp-autoprefixer');// Підключаємо бібліотеку для автоматичного додавання префіксів

gulp.task('browser-sync', function() { // Створюємо таск browser-sync
	browserSync({ // Виконуємо browserSync
		server: { // Визначаємо параметри сервера
			baseDir: 'src' // Директорія для сервера - app
		},
		notify: false // Відключаємо сповіщення
	});
});

gulp.task('sass', function() { // Створюємо таск sass
	return gulp.src('src/scss/**/styles.scss') // Беремо джерело
		.pipe(sass()) // Пeретворюємо Sass в CSS за допомогою gulp-sass
		.pipe(autoprefixer(['last 35 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Створюємо префікси
		.pipe(gulp.dest('src/css')) // Вивантажуємо результат в теку src/css
		.pipe(browserSync.reload({stream: true})) // Оновлюємо CSS на сторінці при зміні коду
});

gulp.task('css-libs', ['sass'], function() {
	return gulp.src('src/css/libs.scss') // Вибираємо файл для мініфікації
		.pipe(sass())
		.pipe(cssnano()) // Стискаємо
		.pipe(rename({suffix: '.min'})) // Додаємо суфікс .min
		.pipe(gulp.dest('src/css')); // Вивантажуємо в теку app/css
});

gulp.task('scripts', function() {
	return gulp.src([ // Беремо всі необхідні бібліотеки
		// 'src/js/*.js'
		// 'src/libs/jquery/dist/jquery.min.js', // Беремо jQuery
		// 'src/libs/modernizr/modernizr.js',
		// 'src/libs/magnific-popup/dist/jquery.magnific-popup.min.js' // Беремо Magnific Popup
		])
		// .pipe(concat('libs.min.js')) // Збираємо їх в купу в новому файлі libs.min.js
		.pipe(uglify()) // Стискаємо JS файл
		.pipe(rename({suffix: '.min'})) // Додаємо суфікс .min
		.pipe(gulp.dest('src/js')); // Вивантажуємо в теку src/js
});

gulp.task('img', function() {
	return gulp.src('src/img/**/*') // Беремо всі зображення із src
		.pipe(cache(imagemin({ // Стискаємо зображення з кешуванням
		// .pipe(imagemin({ // Стискаємо зображення без кешування
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))/**/)
		.pipe(gulp.dest('build/img')); // Вивантажуємо зображення на продакшен
});

gulp.task('clean', function() {
	return del.sync('build'); // Видаляємо теку build перед збіркою
});

gulp.task('clear', function (callback) {
	return cache.clearAll();
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
	gulp.watch('src/scss/**/*.scss', ['sass']); // Спостереження за sass(scss) файлами в теці scss
	gulp.watch('src/*.html', browserSync.reload); // Спостереження за HTML файлами в корені проекту
	gulp.watch('src/js/**/*.js', browserSync.reload);  // Спостереження за JS файлами в теці js
});

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {

	var buildCss = gulp.src([ // Переносимо стилі в продакшен
		// 'src/css/libs.min.css',
		'src/css/styles.css'
		])
		.pipe(cssnano()) // Стискаємо
		.pipe(rename({suffix: '.min'})) // Додаємо суфікс .min
		.pipe(gulp.dest('build/css'))

	var buildFonts = gulp.src('src/fonts/**/*')
		.pipe(gulp.dest('build/fonts')) // Переносимо шрифти в продакшен

	var buildJs = gulp.src('src/js/**/*')
		.pipe(uglify()) // Стискаємо JS файл
		.pipe(rename({suffix: '.min'})) // Додаємо суфікс .min
		.pipe(gulp.dest('build/js')) // Переносимо скрипти в продакшен

	var buildHtml = gulp.src('src/*.html')
		.pipe(gulp.dest('build')); // Переносимо HTML в продакшен

});

gulp.task('default', ['watch']);