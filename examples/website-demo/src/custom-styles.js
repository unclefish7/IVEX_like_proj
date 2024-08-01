// 定义 UI 主题
export const UI_THEME = {
  extends: 'dark', // 继承自 'dark' 主题
  background: 'rgba(51,51,51,0.9)', // 背景颜色
  backgroundAlt: '#222222', // 备用背景颜色

  controlColorPrimary: '#858586', // 主控件颜色
  controlColorSecondary: '#636364', // 次控件颜色
  controlColorDisabled: '#404042', // 禁用控件颜色
  controlColorHovered: '#F8F8F9', // 悬停控件颜色
  controlColorActive: '#5B91F4', // 活动控件颜色

  textColorPrimary: '#F8F8F9', // 主文本颜色
  textColorSecondary: '#D0D0D1', // 次文本颜色
  textColorDisabled: '#717172', // 禁用文本颜色
  textColorInvert: '#1B1B1C', // 反色文本颜色

  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif', // 字体族
  fontSize: 14, // 字体大小
  fontWeight: 200, // 字体粗细

  shadow: '0 2px 4px 0 rgba(0, 0, 0, 0.15)' // 阴影
};

// 播放控制样式
export const PLAYBACK_CONTROL_STYLE = {
  wrapper: {
    paddingTop: 44 // 播放控制器的上内边距
  },
  slider: {
    wrapper: {
      background: 'none' // 滑块包裹元素背景
    },
    track: {
      height: 8, // 滑块轨道高度
      background: '#4b4b4b', // 滑块轨道背景
      borderRadius: 4 // 滑块轨道圆角
    },
    knobSize: 24, // 滑块按钮大小
    trackFill: {
      display: 'none' // 填充轨道显示设置
    },
    knob: props => ({
      width: 2, // 滑块按钮宽度
      borderRadius: 0, // 滑块按钮圆角
      borderColor: props.theme.controlColorActive, // 滑块按钮边框颜色
      marginLeft: -1, // 滑块按钮左边距
      borderWidth: 1 // 滑块按钮边框宽度
    })
  },
  tick: {
    color: '#D0D0D1' // 刻度颜色
  },
  buffer: {
    background: '#111', // 缓冲区背景
    borderRadius: 4 // 缓冲区圆角
  },
  lookAheadSlider: {
    knobSize: 8, // 预览滑块按钮大小
    track: {
      height: 4, // 预览滑块轨道高度
      background: '#111', // 预览滑块轨道背景
      borderRadius: 2 // 预览滑块轨道圆角
    },
    trackFill: {
      background: '#858586', // 预览滑块填充轨道背景
      borderRadius: 2 // 预览滑块填充轨道圆角
    },
    knob: {
      borderWidth: 4 // 预览滑块按钮边框宽度
    }
  },
  lookAheadMarker: props => ({
    borderTopColor: props.theme.controlColorActive // 预览标记顶部边框颜色
  }),
  playPauseButton: {
    width: 24, // 播放暂停按钮宽度
    height: 24, // 播放暂停按钮高度
    marginLeft: 12, // 播放暂停按钮左边距
    marginBottom: 4 // 播放暂停按钮下边距
  },
  controls: {
    borderTop: 'solid 1px #404042', // 控件顶部边框
    marginTop: 4, // 控件顶部边距
    padding: '12px 24px' // 控件内边距
  },
  timestamp: {
    color: '#fff', // 时间戳颜色
    position: 'absolute', // 时间戳定位
    left: 12, // 时间戳左边距
    top: 12 // 时间戳上边距
  }
};

// 工具提示样式
export const TOOLTIP_STYLE = {
  arrowSize: 0, // 工具提示箭头大小
  borderWidth: 0, // 工具提示边框宽度
  background: '#CCCCCC', // 工具提示背景颜色
  body: {
    color: '#141414', // 工具提示文本颜色
    whiteSpace: 'nowrap', // 工具提示文本不换行
    fontSize: 12 // 工具提示字体大小
  }
};

// 工具栏按钮样式
export const TOOLBAR_BUTTON_STYLE = {
  size: 60, // 按钮大小
  wrapper: props => ({
    fontSize: 32, // 按钮字体大小
    background: props.isHovered ? 'rgba(129,133,138,0.3)' : props.theme.background // 悬停时按钮背景
  })
};

// 工具栏菜单样式
export const TOOLBAR_MENU_STYLE = {
  arrowSize: 0, // 菜单箭头大小
  borderWidth: 0, // 菜单边框宽度
  body: {
    left: 56, // 菜单位置
    boxShadow: 'none' // 菜单阴影
  }
};

// 帮助按钮样式
export const HELP_BUTTON_STYLE = {
  size: 20, // 按钮大小
  wrapper: {
    background: 'none' // 按钮背景
  }
};

// 原始类型到图标的映射
const PRIMITIVE_TYPE_TO_ICON = {
  point: '\\e90c',
  circle: '\\e907',
  image: '\\e90a',
  polyline: '\\e90e',
  polygon: '\\e90d',
  float: '\\e917',
  text: '\\e913',
  group: '\\e909'
};

// 流设置样式
export const STREAM_SETTINGS_STYLE = {
  checkbox: {
    wrapper: props => ({
      width: '100%', // 复选框宽度
      position: 'relative', // 复选框定位
      opacity: props.value === 'off' ? 0.4 : 1 // 复选框不选中时透明度
    }),
    border: props => ({
      display: props.isHovered || props.value === 'off' ? 'block' : 'none', // 复选框悬停时显示边框
      position: 'absolute', // 复选框边框定位
      borderStyle: 'none', // 复选框边框样式
      right: 0, // 复选框右边距
      marginRight: 0 // 复选框右内边距
    }),
    icon: props => ({
      fontFamily: 'streetscape', // 复选框图标字体族
      fontSize: 16, // 复选框图标字体大小
      color: props.theme.controlColorPrimary // 复选框图标颜色
    }),
    iconOn: '\ue91c', // 复选框选中图标
    iconOff: '\ue900', // 复选框未选中图标
    iconIndeterminate: '\ue91c' // 复选框中间状态图标
  },
  badge: props => ({
    order: -1, // 徽章顺序
    '&:before':
      props.type in PRIMITIVE_TYPE_TO_ICON
        ? {
            fontFamily: 'streetscape', // 徽章图标字体族
            fontSize: 16, // 徽章图标字体大小
            paddingRight: 12, // 徽章图标右内边距
            content: `"${PRIMITIVE_TYPE_TO_ICON[props.type]}"`
          }
        : {
            content: '""' // 默认内容
          }
  })
};

// 日志查看器样式
export const LOG_VIEWER_STYLE = {
  objectLabelColor: '#D0D0D1', // 对象标签颜色
  objectLabelTipSize: props => (props.isSelected ? 30 : 8), // 对象标签提示大小
  objectLabelTip: props => (props.isSelected ? null : {display: 'none'}), // 对象标签提示显示设置
  objectLabelLine: props => (props.isSelected ? null : {display: 'none'}), // 对象标签线显示设置
  objectLabelBody: props => {
    const {object, xvizStyles, isSelected} = props;

    let background = '#F8F8F9'; // 标签背景颜色
    let color = '#222'; // 标签文字颜色
    if (!isSelected) {
      const feature = object.getFeature('/tracklets/objects');
      const strokeColor = xvizStyles
        .getStylesheet('/tracklets/objects')
        .getProperty('stroke_color', feature);
      if (strokeColor) {
        background = `rgb(${strokeColor.slice(0, 3).join(',')})`;
        const brightness = (strokeColor[0] + strokeColor[1] + strokeColor[2]) / 3;
        color = brightness < 190 ? '#fff' : color;
      }
    }
    return {
      borderRadius: 12, // 标签圆角
      padding: '4px 8px', // 标签内边距
      fontSize: isSelected ? 12 : 14, // 标签字体大小
      color,
      background
    };
  },

  tooltip: {
    maxWidth: 276, // 工具提示最大宽度
    fontSize: 12, // 工具提示字体大小
    background: 'rgba(0,0,0,0.8)', // 工具提示背景颜色
    borderRadius: 4, // 工具提示圆角
    '>hr': {
      width: '100%', // 工具提示分割线宽度
      float: 'left',
      margin: '12px -12px', // 工具提示分割线边距
      padding: '0 12px', // 工具提示分割线内边距
      opacity: 0.2 // 工具提示分割线透明度
    },
    ' b': {
      textTransform: 'capitalize', // 工具提示文本转换为首字母大写
      fontSize: 14 // 工具提示文本字体大小
    },
    '>div': {
      minWidth: '50%', // 工具提示最小宽度
      float: 'left', // 工具提示浮动设置
      margin: '2px 0' // 工具提示边距
    }
  }
};

/* eslint-disable camelcase */
export const XVIZ_STYLE = {
  '/tracklets/objects': [
    {name: 'selected', style: {fill_color: '#ff800088', stroke_color: '#ff8000'}} // 选中的对象样式
  ]
};
/* eslint-enable camelcase */

// 浮动面板样式
export const FLOAT_PANEL_STYLE = {
  wrapper: {
    zIndex: 9999 // 浮动面板的 z-index
  }
};

// XVIZ 面板样式
export const XVIZ_PANEL_STYLE = {
  metric: {
    title: {
      textAlign: 'left', // 标题文本对齐
      fontSize: 14, // 标题字体大小
      fontWeight: 500 // 标题字体粗细
    },
    tooltip: TOOLTIP_STYLE // 工具提示样式
  },
  video: {
    wrapper: {
      cursor: 'grab', // 视频面板光标样式
      position: 'absolute', // 视频面板定位
      width: '100%', // 视频面板宽度
      height: '100%', // 视频面板高度
      paddingTop: 28 // 视频面板上内边距
    },
    selector: {
      wrapper: {
        position: 'absolute', // 选择器定位
        width: 160, // 选择器宽度
        top: 0, // 选择器顶部边距
        left: '50%', // 选择器左边距
        transform: 'translateX(-50%)' // 选择器水平居中
      },
      select: {
        fontSize: 14 // 选择器字体大小
      },
      border: {
        border: 'none' // 选择器边框样式
      }
    }
  }
};
