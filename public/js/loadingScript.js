// const colors = ["#1074AD", "#3A283D", "#E0543F", "#C5FF3D", "#7DFFF2"];
const colors = [COLORS.RED, COLORS.YELLOW, COLORS.GREEN, COLORS.BLUE, COLORS.ORANGE]
const squares = document.querySelectorAll(".Preloader-square");
const tl = new TimelineMax(
    { 
        onComplete: () => {
        tl.invalidate();
        anim();
    } 
});
const anim = function () {
    tl.staggerFromTo(
        squares, 
        0.8,
        {height: 0 },
        {
            cycle: {
                backgroundColor() {
                    return colors[Math.floor(Math.random() * colors.length)];
                },
                height() {
                    return Math.random() * 40 + 10;
                }
            },
            autoAlpha: 1,
            ease: Expo.easeInOut
        },
        0.4
    );
    tl.staggerTo(
        squares,
        0.7,
        { autoAlpha: 0, height: 0, ease: Expo.easeInOut },
        0.4,
        "-=0.5"
    );
};