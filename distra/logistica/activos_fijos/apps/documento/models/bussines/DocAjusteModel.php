<?php

/**
 *
 */
class DocAjusteModel extends DocumentoActivoModel
{

    /**
     *
     */
    public function __construct($idsubsistema = LogisticaGlobal::SUBSISTEMA_AFT)
    {
        parent::__construct($idsubsistema);
    }

    /**
     *
     */
    public function crearDocAjuste($datos, $movimientos, $movimientosCollection)
    {
        $arrMovimientos = array();
        $cDatMovRegnumerico = "DatMovRegnumerico";
        $cDatMovRegnumericoActivo = 'DatMovRegnumericoActivo';
        $sRegNumActivo = new RegNumActivoService();
        $sRegNumActivo->initReNumActivoModel();
        $objRegNumAftModel = new RegNumericoActivoModel();
        $idEstructura = $movimientos[0]['idestructuraop'];

        if (!$movimientosCollection) {
            $movimientosCollection = new Doctrine_Collection('DatMovimientos');
        }

        $datos['idestructuracomun'] = $idEstructura;
        $iddocPadre = $datos['iddocumento'];
        if ($datos['iddocumento']) {
            unset($datos['iddocumento']);
        }

        $documento = $this->addActivoDoc($datos);
        $documento->save();
        $objDocPadre = new DatDocumentoPadre();
        $objDocPadre->idpadre = $iddocPadre;
        $objDocPadre->iddocumento = $documento->iddocumento;
        $objDocPadre->save();


        $idProducto = $movimientos[0]['idproducto'];

        if ($datos['faltantes']) {
            $arrIdesRegNumericos = Array();
        }

        foreach ($movimientos as $key => $arreglo) {

            if ($arreglo['idestructuraop'] == $idEstructura) {
                if ($datos['faltantes']) {
                    $arrIdesRegNumericos[] = $arreglo['idregnumerico'];
                }

                if ($idProducto != $arreglo['idproducto'] || $key == 0) {
                    $movimiento = new DatMovimientos();
                    $posreg = 0;
                    $movimiento->iddocumento = $documento->iddocumento;
                    $movimiento->synchronizeWithArray($arreglo);
                    $movimiento->$cDatMovRegnumerico;
                    $idProducto = $arreglo['idproducto'];
                }


                $movimiento->DatMovRegnumerico[$posreg]->synchronizeWithArray(
                    $arreglo
                );

                $movimiento->DatMovRegnumerico[$posreg]->$cDatMovRegnumericoActivo->synchronizeWithArray(
                    $arreglo
                );

                // Recorro todos los plugins y le inserto los movimientos de registros numéricos de cada plugin
                foreach ($objRegNumAftModel->getListaPlugins() as $plugin) {
                    $plugin->beforeSaveMov(
                        $movimiento->DatMovRegnumerico[$posreg]->$cDatMovRegnumericoActivo, $arreglo
                    );
                }

                $movimientosCollection->add($movimiento);
                $posreg++;
            } else {
                $arrMovimientos[] = $arreglo;
            }
        }

        $movimientosCollection->save();


        if (count($arrMovimientos) > 0) {
            $datos['iddocumento'] = $iddocPadre;
            return self::crearDocAjuste($datos, $arrMovimientos, $movimientosCollection);
        } else {
            $movimientosCollection->save();

            if ($datos['faltantes']) {
                foreach ($movimientosCollection as $objC) {
                    $this->gestdisponibilidad($objC->iddocumento, '-');
                }
            }

            return 2;
        }
    }

    /**
     *
     */
    private function gestDisponibilidad($iddocumento, $signo)
    {
        $movimientos = Doctrine::getTable('DatMovimientos')->findByDql('iddocumento = ?', array($iddocumento));
        foreach ($movimientos AS $mov) {
            $idindicador = $mov->idproducto;
            $cantidad = $mov->cantidad;

            $movimiento = new MovimientoService();
            $movimiento->modDisponibilidadMedios($idindicador, $cantidad, $signo);
        }
    }

}
