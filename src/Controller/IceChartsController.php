<?php

namespace Drupal\ice_charts\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * A controller which loads the ice_charts block and render it.
 */
class IceChartsController extends ControllerBase {

  /**
   * Build the page.
   */
  public function build() {
    $build['ice-charts'] = \Drupal::service('plugin.manager.block')
      ->createInstance('ice_charts_block')
      ->build();

    return $build;
  }

}
