import React from 'react';
import Tippy from '@tippy.js/react';
import Handle from './Handle';

// Wrap Handle for Tippy, by forwarding Tippy's `ref` to `domRef`, and `handleRef` to `ref`.
const HandleWrapper = React.forwardRef(({ handleRef, ...rest }, ref) => <Handle {...rest} domRef={ref} ref={handleRef} />);

export default function createSliderWithTooltip(Component) {
  return class ComponentWrapper extends React.Component {
    static defaultProps = {
      tipFormatter(value) { return value; },
      handleStyle: [{}],
      tipProps: {},
      getTooltipContainer: node => node.parentNode,
    };
    state = {
      visibles: {},
    };
    handleTooltipVisibleChange = (index, visible) => {
      this.setState((prevState) => {
        return {
          visibles: {
            ...prevState.visibles,
            [index]: visible,
          },
        };
      });
    }
    handleWithTooltip = ({ value, dragging, index, disabled, ref, ...restProps }) => {
      const {
        tipFormatter,
        tipProps,
        handleStyle,
        getTooltipContainer,
      } = this.props;

      const {
        prefixCls = 'rc-slider-tooltip',
        overlay = tipFormatter(value),
        placement = 'top',
        visible = false,
        ...restTooltipProps
      } = tipProps;

      let handleStyleWithIndex;
      if (Array.isArray(handleStyle)) {
        handleStyleWithIndex = handleStyle[index] || handleStyle[0];
      } else {
        handleStyleWithIndex = handleStyle;
      }

      return (
        <Tippy
          a11y={false} // no keyboard accessibility
          arrow={true}
          delay={0}
          duration={0}
          content={overlay}
          placement={placement}
          visible={(!disabled && (this.state.visibles[index] || dragging)) || visible}
          key={index}
        >
          <HandleWrapper handleRef={ref}
            {...restProps}
            style={{
              ...handleStyleWithIndex,
            }}
            value={value}
            onMouseEnter={() => this.handleTooltipVisibleChange(index, true)}
            onMouseLeave={() => this.handleTooltipVisibleChange(index, false)}
          />
        </Tippy>
      );
    }
    render() {
      return <Component {...this.props} handle={this.handleWithTooltip} />;
    }
  };
}
