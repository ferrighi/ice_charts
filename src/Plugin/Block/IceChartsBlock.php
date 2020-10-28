<?php
/*
 * @file
 * Contains \Drupal\ice_charts\Plugin\Block\IceChartsBlock
 *
 * BLock to show search map
 *
 */
namespace Drupal\ice_charts\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Block\BlockPluginInterface;
use Drupal\Core\Form\FormStateInterface;


/**
 * Provides a Block.
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
   * {@inheritdoc}
   * Add js to block and return renderarray
   */
  public function build() {
    \Drupal::logger('ice_charts')->debug("Building IceChartsBlock");

    //Building the markup for the ice charts block.
    $build['map-div'] = [
      '#prefix' => '<div id="map" class="map">',
      '#suffix' => '</div>'
    ];

    $build['controls'] = [
      '#prefix' => '<div class="controls w3-panel">',
      '#suffix' => '</div>'
    ];
    $build['controls']['label-slider'] = [
      '#markup' => '<label>'. t('Select a date with the time slider:') . '</label>',
      '#allowed_tags' => ['label'],
    ];
    $build['controls']['wrapper-slider'] = [
      '#markup' => '<div id="dateSlider"></div>',
      '#allowed_tags' => ['div'],
    ];
    $build['controls']['label-cal'] = [
      '#markup' => '<label>' . t('Or, navigate on the calendar:') . '</label>',
      '#allowed_tags' => ['label'],
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
      '#prefix' => '<div class="w3-container w3-center">',
      '#markup' => '<br>',
      '#suffix' => '</div>'
    ];

    $build['table-wrapper']['table'] = [
      '#prefix' => '<table class="w3-table w3-bordered">',
      '#suffix' => '</table>'
    ];
    $build['table-wrapper']['table']['header'] = [
      '#prefix' => '<tr align="center">',
      '#markup' => ' <th style="text-align:center">Colour</th><th style="text-align:center">Ice Categories (Total Concentration)</th>',
      '#suffix' => '</tr>'
    ];
    $build['table-wrapper']['table']['content'] = [
      '#markup' => '
      <tr><td bgcolor= #969696></td><td style="text-align:center">Fast Ice (10/10th)</td></tr>
      <tr><td bgcolor= #FF0000></td><td style="text-align:center">Very Close Drift Ice (9-10/10ths)</td></tr>
      <tr><td bgcolor= #FF7D07></td><td style="text-align:center">Close Drift Ice (7-9/10ths)</td></tr>
      <tr><td bgcolor= #FFFF00></td><td style="text-align:center">Open Drift Ice (4-7/10ths)</td></tr>
      <tr><td bgcolor= #8CFFA0></td><td style="text-align:center">Very Open Drift Ice (1-4/10ths)</td></tr>
      <tr><td bgcolor= #96c9ff></td><td style="text-align:center">Open Water (0-1/10ths)</td></tr>
      '
    ];
    //Attach css and js
    $build['#attached'] = [
      'library' => [
        'ice_charts/ice_charts'
      ],
    ];
    return $build;


  }
}
