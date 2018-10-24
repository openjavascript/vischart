
import Konva from 'konva';
import VisChartBase from '../../common/konvabase.js';

export default class TooltipEvent extends VisChartBase {
    constructor( arc, val ){
        super( arc, val );

        this.arc = arc;
        this.val = val;

        this.stage = null;
        this.tooltipLayer = null;

        this.timer = null;
        this.isAction = false;
        
    }

    //创建tooltipLayer层
    setStage( stage ){
        this.stage = stage;

        this.tooltipLayer = new Konva.Layer({});
        this.addDestroy( this.tooltipLayer );

    }

    //创建tooltip和tooltipBg层
    drawTooltip(){
        //背景色
        let tooltipBg = new Konva.Tag({
            width: 200,     
            height: 45,
            fill: '#000',
            opacity: 0.5,
            lineJoin: 'round',
            cornerRadius: 5,
            visible: false
        });
        //tooltip文字
        let tooltip = new Konva.Text({
            fontFamily: "Calibri",
            fontSize: 12,
            textFill: "#fff",
            fill: "#fff",
            visible: false
        });
        tooltip.lineHeight(1.5);

        this.tooltipLayer.add( tooltipBg, tooltip );

        this.stage.add( this.tooltipLayer );

        let tooltipCon = {
            tooltip: tooltip,
            tooltipBg: tooltipBg
        }
        return tooltipCon
    }
    //创建tooltip移动层动画
    drawTooltipMove(){
        let tooltip = this.drawTooltip().tooltip;
        let tooltipBg = this.drawTooltip().tooltipBg;
        let self = this;

        //添加鼠标事件
        this.arc.on('mousemove', function(){
            if(this.isAction){
                clearTimeout(this.timer);
            }
            this.isAction = true;
            let mousePos = self.stage.getPointerPosition();
            tooltipBg.position({
                x : mousePos.x,
                y : mousePos.y
            });
            tooltip.position({
                x : mousePos.x + 5,
                y : mousePos.y + 5
            });
            let textLabel = `访问来源\n ${self.val.name}: ${self.val.value}(${self.val.percent}%)`;
            tooltip.text(textLabel);
            tooltipBg.show();
            tooltip.show();
            self.tooltipLayer.setZIndex(100);
            self.tooltipLayer.batchDraw();
        })
        this.arc.on('mouseout', function() {
            if(this.isAction){
                this.timer = setTimeout(function(){
                    this.isAction = false;
                    tooltipBg.hide();
                    tooltip.hide();
                    self.tooltipLayer.setZIndex(100);
                    self.tooltipLayer.draw();
                },100)
            }
        });
    }
}