<?php

/**
 *
 */
class DocOrigenModel extends DocumentoActivoModel
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
    public function addActivoDoc($parametros)
    {

        $parametros['numero'] = (int) $parametros['numero'];
        $parametros['iddocumentoinv'] = (int) $parametros['iddocumentoinv'];
        $cDatDocumentoOrigen = 'DatDocumentoOrigen';
        $cDatDocumentoActivo = 'DatDocumentoActivo';

        $objGesDocModelo = DocumentoActivoFactory::getInstance($parametros['idoperacion']);
        $doc = $objGesDocModelo->addActivoDoc($parametros);

        $doc->$cDatDocumentoActivo->$cDatDocumentoOrigen->synchronizeWithArray($parametros);
        return $doc;
    }

    /**
     *
     */
    public function getDatEspecificosDoc($idDocumento)
    {
        $query = $this->getQueryDocumento('d');
        $query->innerJoin('d.DatDocumentoActivo da')
            ->innerJoin('da.DatDocumentoOrigen do')
            ->innerJoin('d.DatDocumentoprim dp')
            ->innerJoin('dp.NomDocprim ndp');

        $query->select(
            '
             do.fecha,
             do.numero as valor,
             do.iddocinventario,
             do.clave,
             ndp.denominacion
        '
        );

        $query->where('d.iddocumento = ?', array($idDocumento));
        $documento = $query->fetchOne();

        $columna = new stdClass();
        $columnas = array();

        $columna->xtype = "textarea";
        $columna->anchor = "95%";

        $colClave = $columna;
        $colClave->fieldLabel = "Clave";
        $colClave->data = $documento['denominacion'];
        array_push($columnas, $colClave);

        $colNumero = $columna;
        $colNumero->fieldLabel = "Número";
        $colNumero->data = $documento['valor'];
        array_push($columnas, $colNumero);

        $colFecha = $columna;
        $colFecha->fieldLabel = "Fecha";
        $colFecha->data = $documento['fecha'];
        array_push($columnas, $colFecha);

        return array("data" => $columnas);
    }

    public function getDatDocOrigen($iddocumantoInventario)
    {
        $query = new Doctrine_Query();

        $query->select('do.iddocumentoinv')
            ->from('DatDocumentoOrigen do');
        $query->where('do.iddocumentoinv is not null');
        $iddocumentInventario = $query->fetchArray();

        if (count($iddocumentInventario) > 0) {
            foreach ($iddocumentInventario as $idInventario) {
                $arrIdDocInventario[] = $idInventario['iddocumentoinv'];
            }
        }
        ($iddocumantoInventario) ? $arrIdDocInventario[] = $iddocumantoInventario : "";

        return $arrIdDocInventario;
    }

    public function getEliminarDocOrigen($parametros)
    {
        $docOrigen = Doctrine::getTable('DatDocumentoOrigen')->find($parametros['iddocumento']);
        if ($docOrigen) {
            $datDocOrigen = $docOrigen->toArray();
            if ($datDocOrigen['iddocorigen'] == $parametros['iddocumento']) {
                $docOrigen->delete();
            }
        }
        return true;
    }

}
