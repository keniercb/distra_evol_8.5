<?php

/**
 * Created by PhpStorm.
 * User: Adrian
 * Date: 08-Jun-20
 * Time: 11:27 AM
 */
class DocTraspasoMasivoResponsabilidad extends DocumentoActivoModel
{
    public function __construct($idsubsistema = LogisticaGlobal::SUBSISTEMA_AFT)
    {
        parent:: __construct($idsubsistema);
    }



    public function aprobarDocumento($idDocumento, $idOperacion, $observaciones, $idEntidadPadre, $signo)
    {
        // Crear prod nuevos
        // Actualizra rn con nuevo resp, nuevo centro costo, nueva idarea
        // Actualizar cantidad y disponible en el area vieja y en el area nueva

        $query_doc = Doctrine_Query::create();
        $query_doc->select('da.idareadestino as idareadestino, 
                                da.idresponsabledestino as idresponsabledestino, 
                                da.idcentrocostodestino as idcentrocostodestino, 
                                d.idestructuracomun as idareaorigen, 
                                d.iddocumento,
                                m.idmovimiento,
                                m.idproducto,
                                mrn.idmovregnumerico,
                                mrn.idregnumerico')
            ->from('DatDocumento d')
            ->innerJoin('d.DatDocumentoActivo da')
            ->innerJoin('d.DatMovimientos m')
            ->innerJoin('m.DatMovRegnumerico mrn')
            ->where('d.iddocumento = ?', $idDocumento)
            ->orderBy('m.idproducto');
        $datosDoc = $query_doc->fetchArray();

        if(count($datosDoc) == 1){
            $idEntidadPadre = ($idEntidadPadre) ? $idEntidadPadre : $this->idestructuracomun;

            foreach ($datosDoc[0]['DatMovimientos'] as $i =>  $mov){
                // Si area desino es distinta al area origen hay que cambiar los idproductos y
                // cambiar las cantidades y desponibls de esos productos
                $idprod = $mov['idproducto'];
                if($datosDoc[0]['idareadestino'] != null && $datosDoc[0]['idareadestino'] != $datosDoc[0]['idareaorigen']){
                    $prod_old = Doctrine::getTable('DatProductoLogistica')->find($mov['idproducto']);
                    $prod_old->cantidad = $prod_old->cantidad - count($mov['DatMovRegnumerico']);
                    $prod_old->disponible = $prod_old->disponible; //-  count($mov['DatMovRegnumerico']);
					if($prod_old->cantidad < 0){
						$prod_old->cantidad = 0;
					}
					if($prod_old->disponible < 0){
						$prod_old->disponible = 0;
					}
                    $prod_old->save();

                    // Verificar si existe el nuevo producto					
					$prod_new = Doctrine::getTable('DatProductoLogistica')
                            ->findByDql('idindicador = ?
							and idestructuracomun = ?
							and idestructura = ?', array(
                                $prod_old->idindicador, $prod_old->idestructuracomun, $datosDoc[0]['idareadestino']
                            ));
					
                    if(count($prod_new->toArray()) > 0){
						$prod_new = $prod_new[0];
                        $prod_new->cantidad = count($mov['DatMovRegnumerico']);
                        $prod_new->disponible = count($mov['DatMovRegnumerico']);
                    }else{
                        $prod_new = new DatProductoLogistica();
                        $prod_new->cantidad = count($mov['DatMovRegnumerico']);
                        $prod_new->disponible = count($mov['DatMovRegnumerico']);
                        $prod_new->idindicador = $prod_old->idindicador;
                        $prod_new->idestructuracomun = $prod_old->idestructuracomun;
                        $prod_new->idestructura = $datosDoc[0]['idareadestino'];
						$prod_new->cronologia = 1;
                    }
                    $prod_new->save();
                    $idprod = $prod_new->idproducto;
                }
				
                foreach ($mov['DatMovRegnumerico'] as $movRn){
                    $rn = Doctrine::getTable('DatRegnumerico')->find($movRn['idregnumerico']);
                    $rn->idproducto = $idprod;
                    $rn->enproceso = 0;
                    if($datosDoc[0]['idareadestino'] != null)
                        $rn->DatRegnumericoActivo->idarearesp = $datosDoc[0]['idareadestino'];
                    if($datosDoc[0]['idresponsabledestino'] != null)
                        $rn->DatRegnumericoActivo->idresponsable = $datosDoc[0]['idresponsabledestino'];
                    if($datosDoc[0]['idcentrocostodestino'] != null)
                        $rn->DatRegnumericoActivo->idcentrocosto = $datosDoc[0]['idcentrocostodestino'];

                    $rn->save();
                }
            }
        }

        $this->trazaDocumento->guardarTraza('Documento aprobado', $idDocumento);
        $this->estadoModel->setEstadoDocumento($idDocumento, EstadoDocumentoModel::ESTADO_APROBADO);
        $this->actualizarAprobadoPoryFecha($idDocumento);
        $cronologia = $this->establecerCronologia($idDocumento);

        $this->producto->getMovimientoModel()->aprobarCronologiaProductos($idDocumento, $cronologia);
        //Para actualizar la cronologia de movimiento para el 107
        $datMov = Doctrine::getTable('DatMovimientos')->findByDql('iddocumento = ?', array($idDocumento));
        $datMov[0]->cronologia = $cronologia;
        $datMov->save();
        return $cronologia;
    }
}