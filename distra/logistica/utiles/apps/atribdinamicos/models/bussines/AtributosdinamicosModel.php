<?php

/**
 * @class     AtributosdinamicosModel
 * @package
 * @author    Osleidy Quiala
 * @copyright 2017 XETID
 * @version   1.0
 */
class AtributosdinamicosModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @param array $filtro
     * @param boolean $dql [Opcional]
     * @return array|Doctrine_Query
     */
    public function cargarAtributos($filtro, $dql = false)
    {
        $query = Doctrine_Query::create()
            ->select(
                "a.idatributo, a.nombre, a.tipodato, a.codigoui, propiedades->>'obligatorio' AS obligatorio, "
                . "propiedades->>'limiteinf' AS limiteinf, propiedades->>'limitesup' AS limitesup, "
                . "propiedades->>'decimal' AS decimal, propiedades->>'precision' AS precision, "
                . "propiedades->>'idexpresionregular' AS idexpresionregular, propiedades->>'multilinea' AS multilinea, "
                . "propiedades->>'idtiponomenclador' AS idtiponomenclador, propiedades->>'longitud1' AS longitud1, "
                . "(case when a.tipodato = 2 then propiedades->>'longitud1' "
                . "else propiedades->>'longitud' end) AS longitud"
            )
            ->from('ConfAtributo a')
            ->orderBy('a.idatributo');
        if ($filtro['idagrupacion']) {// Atributos asociados a la agrupacion.
            if (!$filtro['asociados']) {
                $filtro['idagrupacion'] = 1;
            }
            $query->innerJoin('a.DatAtribAgrupacion ag');
            $query->where('ag.idagrupacion = ?', $filtro['idagrupacion']);
        }
        if ($filtro['criterio']) {
            $query->addWhere("a.nombre ILIKE '%{$filtro['criterio']}%'");
        }
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $filtro)->fetchArray()
        );
    }

    /**
     * Adiciona un atributo dinamico.
     * @param array $datos
     * @return array
     */
    public function adicionarAtributo($datos)
    {
        $record = new ConfAtributo();
        if ($datos['idatributo']) {
            $record->assignIdentifier($datos['idatributo']);
        }
        if ($datos['tipodato'] == 2) {
            $datos['longitud'] = $datos['longitud1'];
        }
        $codigoUI = '';
        switch ($datos['tipodato']) {
            case '1': // Cadena de caracteres.
                if ($datos['longitud'] == '') {
                    $datos['longitud'] = 255;
                }
                $codigoUI = $this->getCodigoCadena($datos);
                break;
            case '2': // Numerico.
                if ($datos['longitud1'] == '') {
                    $datos['longitud1'] = 19;
                    $datos['longitud'] = 19;
                }
                $codigoUI = $this->getCodigoNumerico($datos);
                break;
            case '3': // Booleano.
                $codigoUI = " new Ext.form.Checkbox({boxLabel: '" . $datos['nombre'] . "', tipo: 3 }) ";
                break;
            case '4': // Fecha.
                $codigoUI = " new Ext.form.DateField({ ";
                if ($datos['obligatorio'] == 1) {
                    $codigoUI .= "allowBlank: false, ";
                }
                $codigoUI .= "fieldLabel: '" . $datos['nombre'] . "', format: 'd/m/Y', tipo: 4 }) ";
                break;
            case '5': // Nomenclador.
                $propiedades = Doctrine::getTable('NomTipoNomenclador')->find($datos['idtiponomenclador'])->propiedades;
                $codigoUI = " new LOG.util.ComboBox({fieldLabel: '" . $datos['nombre'] . "', ";
                if ($datos['obligatorio'] == 1) {
                    $codigoUI .= "allowBlank: false, ";
                }
                $codigoUI .= "resizable: true, displayField: 'denominacion', valueField: 'idnomenclador', ";
                $codigoUI .= "tipo: 5, mode: 'remote', pageSize: 30, listWidth: '300px', minChars: 0, ";
                if (json_decode($propiedades)->color) {
                    $codigoUI .= "color: true, itemSelector: 'div.color', ";
                    $codigoUI .= "tpl: new Ext.XTemplate(['<tpl for=\".\"><div class=\"color\" "
                        . "style=\"padding:3px 10px 3px 10px; border:1px solid #fff; border-bottom:1px solid #eeeeee;\">"
                        . "<span><b style=\"background-color:rgb({[this.getCodigo(values.referencia)]});"
                        . "border: 1px solid;\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b> {denominacion}</span></div>"
                        . "</tpl>'].join(''),{getCodigo: function(referencia) { var codigo = referencia.split('-'); "
                        . "return codigo[0] + ',' + codigo[1] + ',' + codigo[2]; } }), ";
                    $codigoUI .= "store: new Ext.data.JsonStore({"
                        . "url: '/logistica/utiles/nomdinamicos/index.php/nomdinamicos/cargarDatosNom', autoLoad: false, "
                        . "idProperty: 'idnomenclador', root: 'datos', "
                        . "fields: ['idnomenclador', 'denominacion', 'referencia'], "
                        . "baseParams: {idtiponomenclador: {$datos['idtiponomenclador']}} }) })";
                } else {
                    $codigoUI .= "url: '/logistica/utiles/nomdinamicos/index.php/nomdinamicos/cargarDatosNom', ";
                    $codigoUI .= "baseParams: {idtiponomenclador: {$datos['idtiponomenclador']}} })";
                }
                break;
        }
        $datos['codigoui'] = $codigoUI;
        $datos['propiedades'] = Zend_Json::encode($datos);
        $record->synchronizeWithArray($datos);
        $datos['idatributo'] = $record->idatributo;
        $record->DatAtribAgrupacion = $this->adicionarAtributoAgrupacion($datos);
        $record->save();
        return array('idatributo' => $record->idatributo);
    }

    /**
     * Verifica si el atributo dinámico existe.
     * @param array $filtro
     * @return boolean
     */
    public function existeAtributo($filtro)
    {
        $query = Doctrine_Query::create()
            ->select('a.idatributo')
            ->from('ConfAtributo a')
            ->where("a.nombre ILIKE '{$filtro['nombre']}'");
        if ($filtro['idatributo']) {
            $query->whereNotIn('a.idatributo', $filtro['idatributo']);
        }
        return $query->count() > 0;
    }

    /**
     * 
     * @param array $datos
     * @param boolean $guardar
     * @return Doctrine_Record
     */
    private function adicionarAtributoAgrupacion($datos)
    {
        $obj = Doctrine::getTable('DatAtribAgrupacion')->findByDql('idatributo = ?', array($datos['idatributo']));
        if ($obj->count() == 0) {
            $record = new DatAtribAgrupacion();
            $record->idatributo = $datos['idatributo'];
            $record->idagrupacion = $datos['idagrupacion'];
            return $record;
        }
        return null;
    }

    private function getCodigoCadena($datos)
    {
        if ($datos['multilinea'] == 1) {
            $codigoUI = " new Ext.form.TextArea({ ";
        } else {
            $codigoUI = " LOG.util.Prototipos.inputTexto({ ";
        }
        $codigoUI .= "fieldLabel: '{$datos['nombre']}', tipo: 1, ";
        if ($datos['idexpresionregular'] != '') {
            $expresionreg = Doctrine::getTable('NomExpresionRegular')->find($datos['idexpresionregular'])->expresion;
            $codigoUI .= "regex: {$expresionreg}, ";
        }
        if ($datos['obligatorio'] == 1) {
            $codigoUI .= "allowBlank: false, ";
        }
        $codigoUI .= "maxLength: {$datos['longitud']} }); ";
        return $codigoUI;
    }

    private function getCodigoNumerico($datos)
    {
        $codigoUI = " LOG.util.Prototipos.inputEntero({ ";
        if ($datos['decimal'] == 1) {
            $codigoUI = " LOG.util.Prototipos.inputDecimal({ ";
        }
        $codigoUI .= "fieldLabel: '" . $datos['nombre'] . "', tipo: 2, ";
        if ($datos['obligatorio'] == 1) {
            $codigoUI .= "allowBlank: false, ";
        }
        if ($datos['limiteinf'] != '') {
            $codigoUI .= "minValue: {$datos['limiteinf']}, ";
        } else {
            $codigoUI .= "minValue: 0, ";
        }
        if ($datos['limitesup'] != '') {
            $codigoUI .= "maxValue: {$datos['limitesup']}, ";
        }
        if ($datos['precision'] == 1) {
            $codigoUI .= "decimalPrecision: {$datos['precision']}, ";
        }
        $codigoUI .= "maxLength: {$datos['longitud1']} }); ";
        return $codigoUI;
    }

    /**
     * Elimina los atributos.
     * @param array $idatributos
     * @return boolean
     */
    public function eliminarAtributo($idatributos)
    {
        Doctrine_Query::create()->delete('ConfAtributo')->whereIn('idatributo ', $idatributos)->execute();
        return true;
    }

    /**
     * Devuelve las expresiones regulares.
     * @return array
     */
    public function cargarComboExpresionReg()
    {
        $query = Doctrine_Query::create()
            ->select('e.idexpresionregular, e.denominacion')
            ->from('NomExpresionRegular e');
        return array('cantidad' => $query->count(), 'datos' => $query->fetchArray());
    }
    
    /**
     * Verifica si los atributos estan en uso.
     * @param array $idatributos
     * @return boolean
     */
    public function atributosEnUso($idatributos)
    {
        $query = Doctrine_Query::create()
            ->select('at.idatributotabla')
            ->from('DatAtributoTabla at')
            ->innerJoin('at.DatAtribAgrupacion aa')
            ->whereIn('aa.idatributo', $idatributos);
        return $query->count() > 0;
    }

    /**
     * Asocia los atributos dinamicos con una agrupacion.
     * @param array $datos
     */
    public function asociarAtributo($datos)
    {
        Doctrine_Query::create()->delete('DatAtribAgrupacion')->whereIn('idatributo', $datos['idatributos'])->execute();
        $collection = new Doctrine_Collection('DatAtribAgrupacion');
        foreach ($datos['idatributos'] as $idatributo) {
            if (!$datos['asociar']) {
                $datos['idagrupacion'] = 1;
            }
            $datos['idatributo'] = $idatributo;
            $record = $this->adicionarAtributoAgrupacion($datos);
            $collection->add($record);
        }
        if ($collection->count() > 0) {
            $collection->save();
        }
    }

}
