<?php

/******************************************************************************
 * Copyright (c) 2016. Todos los derechos reservados. RRHH-XETID              *
 ******************************************************************************/
class ReporteWord
{

    var $idpersona;
    var $rtf;
    var $sect;
    var $table;

    public function ReporteWord($ficha_data)
    {
        $dir = $_SERVER ['DOCUMENT_ROOT'];
        $apps = str_replace('/web', '/', $dir);
        require_once($apps . 'apps/pvd/comun/recursos/rtf/Rtf.php');
        $this->datos = $ficha_data;
    }

    public function salvarPerfil()
    {
        $this->rtf = new Rtf();
        $this->sect = &$this->rtf->addSection();
        $this->sect->setPaperHeight(27.94);
        $this->sect->setPaperWidth(21.59);
        $this->sect->setMargins(1, 2.2, 2.2, 2.2);

        $this->sect->writeText('<b>'.$this->datos->titulo.'</b><br>', new Font(14, Arial), new ParFormat('center'));

        $this->sect->writeText('<br>', new Font(14, Arial), new ParFormat('center'));

        $long = count($this->datos->campos);

        $cantfila =  count($this->datos->datos);

        $this->table = &$this->sect->addTable('left');
        $this->table->addRows($cantfila+1, 0.5);
        $this->table->addColumnsList(array(2, 2, 2, 2,2,2,2,2,2,2,2,2,2,2,2));
        $this->table->setVerticalAlignmentOfCells('left', 1, 1, 2, 3);
        $this->table->setVerticalAlignmentOfCells('left', 1, 4, 1, 4);

        $contcolum = 1;

        for ($i = 0; $i < $long; $i++){
            $this->table->writeToCell(1, $contcolum, '<b>'.$this->datos->campos[$i]->text.'</b>', new Font(11, Arial), new ParFormat('center'));
            $contcolum++;
        }
        $this->table->setBordersOfCells(new BorderFormat(1, "#000000"), 1, 1, 1, $long, true, true, true, true);

        $count = 2;

        if ($long) {
            for ($i = 0; $i <$cantfila; $i++) {
                $c = 1;
                for ($j = 0; $j < $long; $j++){
                    $this->table->writeToCell($count, $c, ' ', new Font(11, Arial), new ParFormat('left'));
                    $this->table->writeToCell($count, $c, $this->datos->datos[$i][$this->datos->campos[$j]->alias], new Font(11, Arial), new ParFormat('center'));
                    $c++;
                }
                $count++;
            }
        }
        $this->table->setBordersOfCells(new BorderFormat(1, "#000000"), 1, 1, count($this->datos->datos)+1, $long, true, true, true, true);

        $this->rtf->save('ReporteWord.rtf');
    }

}