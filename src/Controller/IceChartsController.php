<?php

namespace Drupal\ice_charts\Controller;

use Drupal\Core\Controller\ControllerBase;

class IceChartsController extends ControllerBase {

    public function build() {
      $build['ice-charts'] = \Drupal::service('plugin.manager.block')
        ->createInstance('ice_charts_block')
        ->build();

      return $build;
    }
  }
