<?php
    class ZendExt_ADT_Queue
    {
     private $count;
     private $head;
     private $end;
     
     public function  Zend_ADT_Queue()
     { }
          
     public function Put($date)
     {
        if ($this->count == 0)
        {
         $this->head = new Zend_ADT_Node($date);
         $this->end = $this->head;    
        }else
        {
          $temp = $this->end;
          $this->end = new Zend_ADT_Node($date);
          $this->temp->next = $this->end;
          
        }
        $this->count ++;
      }
     
     
     
      public function Extract() 
      {
       if ($this->count > 0)
       {
           if ($this->count == 1)
           {
            $temp = $this->head;
            $this->head = null;
            $this->end = null;
            return $this->temp;
           } else
           {
             $temp = $this->head;
             $this->head = $this->head->next;
             return $this->temp; 
           }
         $this->count --;
        }
       }
     
     
       public function Head()
       {
         if ($this->head != null)
          return $this->head;
       }
     
       public function End()
       {
         if ( $this->end != null)
          return $this->end;
       }
       
       public function Count()
       {
         return $this->count;  
       }
   }
      
   
