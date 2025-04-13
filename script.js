document.addEventListener('DOMContentLoaded', function() {
    const addRowBtn = document.getElementById('addRow');
    const table = document.getElementById('items').getElementsByTagName('tbody')[0];
    const generatePDFBtn = document.getElementById('generatePDF');

    // Add new row
    addRowBtn.addEventListener('click', function() {
        const newRow = table.insertRow();
        newRow.innerHTML = `
            <td><input type="text" class="item-name"></td>
            <td><input type="number" class="item-qty"></td>
            <td><input type="number" class="item-price"></td>
            <td class="item-total">$0.00</td>
        `;
        addRowEvents(newRow);
    });

    // Calculate row totals
    function addRowEvents(row) {
        const qtyInput = row.querySelector('.item-qty');
        const priceInput = row.querySelector('.item-price');
        const totalCell = row.querySelector('.item-total');

        function updateTotal() {
            const qty = parseFloat(qtyInput.value) || 0;
            const price = parseFloat(priceInput.value) || 0;
            const total = qty * price;
            totalCell.textContent = `$${total.toFixed(2)}`;
            updateFinalTotal();
        }

        qtyInput.addEventListener('input', updateTotal);
        priceInput.addEventListener('input', updateTotal);
    }

    // Update final total
    function updateFinalTotal() {
        const totals = document.querySelectorAll('.item-total');
        let sum = 0;
        totals.forEach(cell => {
            const value = parseFloat(cell.textContent.replace('$', '')) || 0;
            sum += value;
        });
        document.getElementById('finalTotal').textContent = `$${sum.toFixed(2)}`;
    }

    // Generate PDF
    generatePDFBtn.addEventListener('click', function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.text('INVOICE', 105, 15, { align: 'center' });
        doc.text(`Company: ${document.getElementById('companyName').value}`, 20, 30);
        doc.text(`Client: ${document.getElementById('clientName').value}`, 20, 40);
        doc.text(`Date: ${document.getElementById('invoiceDate').value}`, 20, 50);
        
        // Add table (simplified)
        doc.autoTable({
            startY: 60,
            head: [['Item', 'Qty', 'Price', 'Total']],
            body: getTableData()
        });
        
        doc.text(`TOTAL: ${document.getElementById('finalTotal').textContent}`, 150, doc.lastAutoTable.finalY + 10);
        doc.save('invoice.pdf');
    });

    // Extract table data for PDF
    function getTableData() {
        const rows = table.querySelectorAll('tr');
        const data = [];
        rows.forEach(row => {
            const name = row.querySelector('.item-name').value;
            const qty = row.querySelector('.item-qty').value;
            const price = row.querySelector('.item-price').value;
            const total = row.querySelector('.item-total').textContent;
            if (name) data.push([name, qty, price, total]);
        });
        return data;
    }

    // Initialize first row
    addRowEvents(table.rows[0]);
});