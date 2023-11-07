<?php

namespace Drupal\ice_charts\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Block\BlockPluginInterface;

/**
 * Provides an ice_charts block.
 *
 * @Block(
 *   id = "ice_charts_block",
 *   admin_label = @Translation("Visualization of Ice Charts"),
 *   category = @Translation("METNO"),
 * )
 * {@inheritdoc}
 */
class IceChartsBlock extends BlockBase implements BlockPluginInterface {

  /**
   * Add js to block and return renderarray.
   *
   * {@inheritdoc}
   */
  public function build() {
    // Building the markup for the ice charts block.
    $build['map-div'] = [
      '#prefix' => '<div data-ice-map id="map" class="map">',
      '#suffix' => '</div>',
    ];

    $build['controls'] = [
      '#prefix' => '<div class="controls w3-container w3-panel w3-padding-16 w3-card-4">',
      '#suffix' => '</div>',
    ];
    $build['controls']['label-slider'] = [
      '#markup' => '<strong><label>' . $this->t('Select a date with the time slider:') . '</label></strong>',
      '#allowed_tags' => ['label', 'strong'],
    ];
    $build['controls']['wrapper-slider'] = [
      '#markup' => '<div id="dateSlider"></div>',
      '#allowed_tags' => ['div'],
    ];
    $build['controls']['label-cal'] = [
      '#markup' => '<strong><label>' . $this->t('Or, navigate on the calendar:') . '</label></strong>',
      '#suffix' => '<br>',
      '#allowed_tags' => ['label', 'strong'],
    ];
    $build['controls']['button-prev-month'] = [
      '#markup' => '<button title="previous month" class="prev-month btn btn-outline-secondary"><i id="arrow" class="arrow left"></i><i  id="arrow"  class="arrow left"></i></button>',
      '#allowed_tags' => ['button', 'i'],
    ];
    $build['controls']['button-prev-day'] = [
      '#markup' => '<button title="previous day" class="prev-day btn btn-outline-secondary"><i  id="arrow" class="arrow left"></i></button>',
      '#allowed_tags' => ['button', 'i'],
    ];
    $build['controls']['input'] = [
      '#markup' => '<input type="dateTime" id="datepicker"  name="datepicker" readonly="true">',
      '#allowed_tags' => ['input'],
    ];
    $build['controls']['button-next-day'] = [
      '#markup' => '<button title="next day" class="next-day btn btn-outline-secondary"><i  id="arrow" class="arrow right"></i></button>',
      '#allowed_tags' => ['button', 'i'],
    ];
    $build['controls']['button-next-month'] = [
      '#markup' => '<button title="next month" class="next-month btn btn-outline-secondary"><i  id="arrow" class="arrow right"></i><i  id="arrow" class="arrow right"></i></button>',
      '#allowed_tags' => ['button', 'i'],
    ];
    $build['controls']['box-date'] = [
      '#markup' => '<div id="boxDate"></div>',
      '#allowed_tags' => ['div'],
    ];

    $build['table-wrapper'] = [
      '#prefix' => '<div class="w3-container w3-center w3-card-4 w3-padding-32" >',
      '#suffix' => '</div>',
    ];

    $build['table-wrapper']['table'] = [
      '#prefix' => '<table class="w3-table-all w3-centered">',
      '#suffix' => '</table>',
    ];
    $build['table-wrapper']['table']['header'] = [
      '#prefix' => '<tr class="w3-indigo" >',
      '#markup' => '<th >Colour</th><th >Ice Categories (Total Concentration)</th>',
      '#suffix' => '</tr>',
    ];
    $build['table-wrapper']['table']['content'] = [
      '#markup' => '
      <tr ><td bgcolor= #969696></td><td >Fast Ice (10/10th)</td></tr>
      <tr ><td bgcolor= #FF0000></td><td >Very Close Drift Ice (9-10/10ths)</td></tr>
      <tr ><td bgcolor= #FF7D07></td><td >Close Drift Ice (7-9/10ths)</td></tr>
      <tr ><td bgcolor= #FFFF00></td><td >Open Drift Ice (4-7/10ths)</td></tr>
      <tr ><td bgcolor= #8CFFA0></td><td >Very Open Drift Ice (1-4/10ths)</td></tr>
      <tr ><td bgcolor= #96c9ff></td><td ">Open Water (0-1/10ths)</td></tr>
      ',
    ];

    // Attach css and js.
    $build['#attached'] = [
      'library' => [
        'ice_charts/ice_charts',
      ],
    ];
    return $build;

  }

}
