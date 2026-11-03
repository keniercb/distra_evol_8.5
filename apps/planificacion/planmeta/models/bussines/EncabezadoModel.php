<?php

class EncabezadoModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function AdicionarEncabezado($idtipomodelo)
    {
        $this->_meta = ZendExt_Metadata::getInstance();
        $tipoModelo = Doctrine::getTable('NomTipomodelo')->find($idtipomodelo);
        $enc = 'encab_'
            . $idtipomodelo; //la tabla encabezado se creara concatenando encab_idtipomodelo
        $tabla = $this->_meta->Concept()->adicionarTabla(
            'mod_planificacionmeta', $enc, 0
        );
        $tipoModelo->idtablaencabezado = $tabla['idtabla'];
        $tipoModelo->save();
        return $tabla['idtabla'];
    }

    public function AdicionarAtributosaEncabezado(
        $denomcampo, $idtipodato, $idexpresionregular, $idcampovf,
        $idcampodf
    )
    {
        $this->_meta = ZendExt_Metadata::getInstance();
        $denom = str_replace(' ', '_', $denomcampo);

        switch ($idtipodato) {
            case 1 : {
                $arrayConfig['etiqueta'] = $denom;
                $arrayConfig['limiteInferior'] = 20; //Mandar el Alias
                $arrayConfig['limiteSuperior'] = 100; //Mandar el Alias
                break;
                }
            case 2 : { //Texto
                $arrayConfig ['etiqueta'] = $denom;
                $arrayConfig['idexpresionregular'] = $idexpresionregular;
                break;
                }
            case 3 : { //Fecha
                $arrayConfig['etiqueta'] = $denom;
                break;
                }
            case 4 : { //Chek
                $arrayConfig ['etiqueta'] = $denom;
                $arrayConfig ['valor'] = 0;
                break;
                }
            case 5 : { //Nomenclador
                $arrayConfig ['idcampodf'] = $idcampodf;
                $arrayConfig ['idcampovf'] = $idcampovf; //campo bloqueado
                $dat->mensaje = 'Nomenclador';
                break;
                }
            default : {
                $dat->mensaje
                    = 'Error al insertar el campo, no existe un tipo de dato asociado.';
                break;
                }
        }
        $dat->codMsg = 1;
        return $dat;
    }

    public function LlenarEncabezado($idmodelo)
    {
        $modelo = Doctrine::getTable('DatModelo')->find($idmodelo);
        $idtipomodelo = $modelo->idtipomodelo;
        $idtablaencab = NomTipomodelo::getIdTablaEncabezadoDadoIdTipoModelo(
            $idtipomodelo
        );
        $idtablaencabezado = $idtablaencab[0]['idtablaencabezado'];
        $this->_meta = ZendExt_Metadata::getInstance();
        $this->_meta->Metadata()->insertarEnMetadatos(
            $idtablaencabezado, $this->_request->getParams(),
            array('idmodelo' => $idmodelo)
        );
    }

    public function CargarEncabezadoVacio($idtipomodelo)
    {
        $this->_meta = ZendExt_Metadata::getInstance();
        $idtablaencab = NomTipomodelo::getIdTablaEncabezadoDadoIdTipoModelo(
            $idtipomodelo
        );
        $data = $this->_meta->Attribute()->obtenerCamposConRepresentacion(
            $idtablaencab[0]['idtablaencabezado']
        );
        return $data;
    }

    public function EliminarAtributo($idcampo)
    {
        $this->_meta->Attribute()->eliminarCampo(
            $idcampo
        );
        $dat->codMsg = 1;
        $dat->mensaje = 'El campo ha sido eliminado satisfactoriamente.';
        return $dat;
    }

    public function ImportarCamposEncabezado(
        $denomcampo, $idtipodato, $idexpresionregular, $idcampovf,
        $idcampodf, $limiteInferior,
        $limiteSuperior, $etiqueta, $valor
    )
    {
        $this->_meta = ZendExt_Metadata::getInstance();
        switch ($idtipodato) {
            case 1 : {
                $arrayConfig['etiqueta'] = $etiqueta;
                $arrayConfig['limiteInferior'] = $limiteInferior;
                $arrayConfig['limiteSuperior'] = $limiteSuperior;
                break;
                }
            case 2 : { //Texto
                $arrayConfig ['etiqueta'] = $etiqueta;
                $arrayConfig['idexpresionregular'] = $idexpresionregular;
                break;
                }
            case 3 : { //Fecha
                $arrayConfig['etiqueta'] = $denomcampo;
                break;
                }
            case 4 : { //Chek
                $arrayConfig ['etiqueta'] = $etiqueta;
                $arrayConfig ['valor'] = $valor;
                break;
                }
            case 5 : { //Nomenclador
                $arrayConfig ['idcampodf'] = $idcampodf;
                $arrayConfig ['idcampovf'] = $idcampovf;
                $dat->mensaje = 'Nomenclador';
                break;
                }
            default : {
                $dat->mensaje
                    = 'Error al insertar el campo, no existe un tipo de dato asociado.';
                break;
                }
        }
        $dat->codMsg = 1;
        $dat->mensaje = 'El campo ha sido importado satisfactoriamente.';
        return $dat;
    }

}

