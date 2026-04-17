import { useState } from "react";
import { useTheme } from "@/context/theme-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  useCreateTransactionMutation,
  useGetAllTransactionsQuery,
} from "@/features/transaction/transactionAPI";
import { toast } from "sonner";
import {
  Users,
  PlusCircle,
  Receipt,
  Coins,
  UserPlus,
  Calculator,
  ArrowRightLeft,
  X
} from "lucide-react";

const SplitPay = () => {
  const { theme } = useTheme();
  const [groupName, setGroupName] = useState("");
  const [people, setPeople] = useState<string[]>([]);
  const [newPerson, setNewPerson] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [paidBy, setPaidBy] = useState("");
  const [splitAmong, setSplitAmong] = useState<string[]>([]);

  const [createTransaction] = useCreateTransactionMutation();

  // Fetch all expenses for this group
  const { data } = useGetAllTransactionsQuery(
    { keyword: groupName },
    { skip: !groupName }
  );

  const transactions = data?.transations || [];

  // Calculate balances
  const calculateBalances = () => {
    const balances: Record<string, number> = {};

    transactions.forEach((tx: any) => {
      if (!tx.paidBy || !tx.participants?.length) return;

      const share = tx.amount / tx.participants.length;

      balances[tx.paidBy] = (balances[tx.paidBy] || 0) + tx.amount;

      tx.participants.forEach((p: string) => {
        balances[p] = (balances[p] || 0) - share;
      });
    });

    return balances;
  };

  const balances = calculateBalances();

  const splitAmount = splitAmong.length > 0 ? (amount / splitAmong.length).toFixed(2) : "0.00";
  const totalExpenses = transactions.length;
  const totalAmount = transactions.reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0);

  const addPerson = () => {
    if (!newPerson.trim()) {
      toast.error("Please enter a name");
      return;
    }
    if (people.includes(newPerson.trim())) {
      toast.warning(`${newPerson} is already in the group`);
      return;
    }
    setPeople([...people, newPerson.trim()]);
    setNewPerson("");
    toast.success(`${newPerson.trim()} added to group`);
  };

  const removePerson = (personToRemove: string) => {
    setPeople(people.filter(p => p !== personToRemove));
    setSplitAmong(splitAmong.filter(p => p !== personToRemove));
    if (paidBy === personToRemove) setPaidBy("");
  };

  const saveExpense = async () => {
    if (!groupName) {
      toast.error("Please create or select a group first");
      return;
    }
    if (!title.trim()) {
      toast.error("Expense title is required");
      return;
    }
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!paidBy) {
      toast.error("Please select who paid");
      return;
    }
    if (splitAmong.length === 0) {
      toast.error("Please select at least one person to split with");
      return;
    }

    try {
      await createTransaction({
        title,
        amount,
        category: groupName,
        type: "EXPENSE",
        description: `Split expense for ${groupName}`,
        date: new Date().toISOString(),
        isRecurring: false,
        paymentMethod: "CASH",
        paidBy,
        participants: splitAmong,
      }).unwrap();

      toast.success("Expense added successfully!");

      // Reset expense fields
      setTitle("");
      setAmount(0);
      setPaidBy("");
      setSplitAmong([]);
    } catch (err) {
      toast.error("Failed to save expense");
    }
  };

  const handleSelectAll = () => {
    if (people.length === 0) {
      toast.warning("Add people to the group first");
      return;
    }
    setSplitAmong([...people]);
  };

  const handleClearSelection = () => {
    setSplitAmong([]);
  };

  // Theme-based styling
  const themeClasses = {
    container: theme === "harry-potter" 
      ? "bg-gradient-to-br from-gray-950 via-purple-950 to-gray-900 min-h-screen" 
      : "bg-gray-50 min-h-screen",
    card: theme === "harry-potter" 
      ? "bg-gray-900/90 border-purple-900/50" 
      : "bg-white border-gray-200",
    cardHeader: theme === "harry-potter" 
      ? "border-purple-900/30" 
      : "border-gray-200",
    title: theme === "harry-potter" 
      ? "text-white" 
      : "text-gray-900",
    subtitle: theme === "harry-potter" 
      ? "text-gray-400" 
      : "text-gray-600",
    input: theme === "harry-potter" 
      ? "bg-gray-800/50 border-purple-800 text-white placeholder:text-gray-400" 
      : "bg-white border-gray-300 text-gray-900",
    badge: theme === "harry-potter" 
      ? "bg-purple-900/30 text-purple-300 border-purple-700/50" 
      : "bg-blue-100 text-blue-800 border-blue-200",
    buttonPrimary: theme === "harry-potter" 
      ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" 
      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
    buttonSecondary: theme === "harry-potter" 
      ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700" 
      : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200",
    separator: theme === "harry-potter" 
      ? "bg-gray-700" 
      : "bg-gray-200",
  };

  return (
    <div className={themeClasses.container}>
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${theme === "harry-potter" ? "bg-gradient-to-br from-purple-600 to-blue-600" : "bg-gradient-to-r from-blue-600 to-purple-600"}`}>
              <ArrowRightLeft className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold ${themeClasses.title}`}>
                SplitPay
              </h1>
              <p className={themeClasses.subtitle}>
                Divide expenses fairly with friends and family
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Group & Expense Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Group Creation Card */}
            <Card className={`shadow-lg ${themeClasses.card}`}>
              <CardHeader className={`border-b ${themeClasses.cardHeader}`}>
                <CardTitle className={`flex items-center gap-2 ${themeClasses.title}`}>
                  <Users className={`h-5 w-5 ${theme === "harry-potter" ? "text-purple-400" : "text-blue-600"}`} />
                  Create Group
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label className={themeClasses.subtitle}>Group Name</Label>
                  <Input
                    placeholder="e.g., Trip with friends, Office expenses"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className={`mt-1 ${themeClasses.input}`}
                  />
                </div>

                <div>
                  <Label className={themeClasses.subtitle}>Add People</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      placeholder="Enter person's name"
                      value={newPerson}
                      onChange={(e) => setNewPerson(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addPerson()}
                      className={themeClasses.input}
                    />
                    <Button 
                      onClick={addPerson}
                      className={themeClasses.buttonPrimary}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>

                {/* People Tags */}
                {people.length > 0 && (
                  <div className="mt-4">
                    <Label className={themeClasses.subtitle}>
                      Group Members ({people.length})
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {people.map((p) => (
                        <div
                          key={p}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full border ${theme === "harry-potter" ? "bg-purple-900/30 border-purple-700/50" : "bg-blue-50 border-blue-200"} group`}
                        >
                          <span className={themeClasses.title}>{p}</span>
                          <button
                            onClick={() => removePerson(p)}
                            className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className={`h-3 w-3 ${theme === "harry-potter" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Expense Form Card */}
            <Card className={`shadow-lg ${themeClasses.card}`}>
              <CardHeader className={`border-b ${themeClasses.cardHeader}`}>
                <CardTitle className={`flex items-center gap-2 ${themeClasses.title}`}>
                  <Receipt className={`h-5 w-5 ${theme === "harry-potter" ? "text-blue-400" : "text-green-600"}`} />
                  Add New Expense
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className={themeClasses.subtitle}>Expense Title</Label>
                    <Input
                      placeholder="e.g., Dinner, Movie tickets"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`mt-1 ${themeClasses.input}`}
                    />
                  </div>

                  <div>
                    <Label className={`flex items-center gap-1 ${themeClasses.subtitle}`}>
                      <Coins className="h-4 w-4" />
                      Amount (₹)
                    </Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount || ""}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className={`mt-1 ${themeClasses.input}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className={themeClasses.subtitle}>Paid By</Label>
                    <select
                      className={`w-full p-2.5 mt-1 rounded-lg border ${theme === "harry-potter" ? "bg-gray-800/50 border-purple-800 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                      value={paidBy}
                      onChange={(e) => setPaidBy(e.target.value)}
                    >
                      <option value="">Select who paid</option>
                      {people.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label className={themeClasses.subtitle}>Split Among</Label>
                    <div className="flex gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                        className={themeClasses.buttonSecondary}
                      >
                        Select All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearSelection}
                        className={themeClasses.buttonSecondary}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Split Selection */}
                {people.length > 0 && (
                  <div>
                    <Label className={themeClasses.subtitle}>Select people to split with:</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                      {people.map((p) => (
                        <div
                          key={p}
                          className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${splitAmong.includes(p)
                            ? theme === "harry-potter" 
                              ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/50' 
                              : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300'
                            : theme === "harry-potter"
                              ? 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                          onClick={() =>
                            setSplitAmong(
                              splitAmong.includes(p)
                                ? splitAmong.filter((x) => x !== p)
                                : [...splitAmong, p]
                            )
                          }
                        >
                          <Checkbox
                            checked={splitAmong.includes(p)}
                            className={splitAmong.includes(p) 
                              ? theme === "harry-potter" ? "bg-purple-600 border-purple-600" : "bg-blue-600 border-blue-600"
                              : ""
                            }
                          />
                          <span className={`text-sm font-medium ${splitAmong.includes(p) ? themeClasses.title : themeClasses.subtitle}`}>
                            {p}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Split Preview */}
                {splitAmong.length > 0 && (
                  <div className={`p-4 rounded-lg border ${theme === "harry-potter" 
                    ? 'bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-800/50' 
                    : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={themeClasses.subtitle}>Each person pays:</p>
                        <p className={`text-2xl font-bold ${themeClasses.title}`}>₹ {splitAmount}</p>
                      </div>
                      <Calculator className={`h-8 w-8 ${theme === "harry-potter" ? "text-purple-400" : "text-blue-600"}`} />
                    </div>
                    <p className={`text-xs mt-2 ${themeClasses.subtitle}`}>
                      Split equally among {splitAmong.length} {splitAmong.length === 1 ? 'person' : 'people'}
                    </p>
                  </div>
                )}

                <Button
                  onClick={saveExpense}
                  className={`w-full py-6 text-lg font-semibold ${themeClasses.buttonPrimary}`}
                  disabled={!groupName || !title || !amount || !paidBy || splitAmong.length === 0}
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Save Expense
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary & Balances */}
          <div className="space-y-6">
            {/* Group Summary Card */}
            <Card className={`shadow-lg ${themeClasses.card}`}>
              <CardHeader className={`border-b ${themeClasses.cardHeader}`}>
                <CardTitle className={themeClasses.title}>Group Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {groupName ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className={themeClasses.subtitle}>Group Name</span>
                        <span className={`font-semibold ${themeClasses.title}`}>{groupName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={themeClasses.subtitle}>Total Members</span>
                        <Badge className={themeClasses.badge}>{people.length}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={themeClasses.subtitle}>Total Expenses</span>
                        <Badge className={theme === "harry-potter" 
                          ? "bg-green-900/30 text-green-300 border-green-700/50" 
                          : "bg-green-100 text-green-800 border-green-200"
                        }>
                          {totalExpenses}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={themeClasses.subtitle}>Total Amount</span>
                        <span className={`text-lg font-bold ${themeClasses.title}`}>
                          ₹ {totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Separator className={themeClasses.separator} />

                    {/* Balances */}
                    {Object.keys(balances).length > 0 && (
                      <div>
                        <h3 className={`font-semibold mb-3 ${themeClasses.title}`}>
                          Current Balances
                        </h3>
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                          {Object.entries(balances).map(([name, value]) => {
                            const isPositive = value > 0;
                            const isNegative = value < 0;
                            
                            return (
                              <div
                                key={name}
                                className={`p-3 rounded-lg ${theme === "harry-potter" 
                                  ? 'bg-gray-800/30 hover:bg-gray-800/50' 
                                  : 'bg-gray-50 hover:bg-gray-100'
                                } transition-colors`}
                              >
                                <div className="flex justify-between items-center">
                                  <span className={`font-medium ${themeClasses.title}`}>{name}</span>
                                  <div className="text-right">
                                    <span className={`font-semibold ${
                                      isPositive 
                                        ? theme === "harry-potter" ? 'text-green-400' : 'text-green-600'
                                        : isNegative 
                                        ? theme === "harry-potter" ? 'text-red-400' : 'text-red-600'
                                        : themeClasses.subtitle
                                    }`}>
                                      {isPositive ? '+' : ''}₹ {Math.abs(value).toFixed(2)}
                                    </span>
                                    <p className={`text-xs mt-1 ${themeClasses.subtitle}`}>
                                      {isPositive ? 'gets back' : isNegative ? 'owes' : 'settled'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Settlement Stats */}
                        <div className={`p-3 mt-4 rounded-lg border ${
                          theme === "harry-potter" 
                            ? 'bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-800/50' 
                            : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
                        }`}>
                          <p className={`text-sm font-medium ${themeClasses.subtitle}`}>To settle all debts:</p>
                          <div className="space-y-2 mt-2">
                            <div className="flex justify-between">
                              <span className={`text-sm ${themeClasses.subtitle}`}>Total to pay</span>
                              <span className={`text-sm font-semibold ${theme === "harry-potter" ? "text-red-400" : "text-red-600"}`}>
                                ₹ {Object.values(balances)
                                  .filter(v => v < 0)
                                  .reduce((sum, v) => sum + Math.abs(v), 0)
                                  .toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className={`text-sm ${themeClasses.subtitle}`}>Total to receive</span>
                              <span className={`text-sm font-semibold ${theme === "harry-potter" ? "text-green-400" : "text-green-600"}`}>
                                ₹ {Object.values(balances)
                                  .filter(v => v > 0)
                                  .reduce((sum, v) => sum + v, 0)
                                  .toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className={`h-12 w-12 mx-auto mb-3 ${theme === "harry-potter" ? "text-gray-700" : "text-gray-300"}`} />
                    <p className={themeClasses.subtitle}>Create a group to see summary</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitPay;